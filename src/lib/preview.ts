import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export type LinkPreview = {
  title?: string;
  imageUrl?: string;
  price?: string;
  /** true als alleen een titel uit de link zelf is afgeleid */
  partial?: boolean;
};

const MAX_BYTES = 800_000;
const MAX_REDIRECTS = 4;

function isPrivateIPv4(ip: string) {
  const [a, b] = ip.split(".").map(Number);
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
}

function isPrivateIp(ip: string) {
  const version = isIP(ip);
  if (version === 4) return isPrivateIPv4(ip);
  if (version === 6) {
    const lower = ip.toLowerCase();
    if (lower === "::1" || lower === "::") return true;
    if (lower.startsWith("::ffff:")) return isPrivateIp(lower.slice(7));
    return (
      lower.startsWith("fc") ||
      lower.startsWith("fd") ||
      lower.startsWith("fe8") ||
      lower.startsWith("fe9") ||
      lower.startsWith("fea") ||
      lower.startsWith("feb")
    );
  }
  return true;
}

async function assertPublicUrl(url: URL) {
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Alleen http(s)-links");
  }
  if (url.port && url.port !== "80" && url.port !== "443") {
    throw new Error("Poort niet toegestaan");
  }
  const host = url.hostname.replace(/^\[|\]$/g, "");
  const addresses = isIP(host)
    ? [{ address: host }]
    : await lookup(host, { all: true });
  if (addresses.length === 0 || addresses.some((a) => isPrivateIp(a.address))) {
    throw new Error("Adres niet toegestaan");
  }
}

async function readLimited(res: Response) {
  const reader = res.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (total < MAX_BYTES) {
    const { done, value } = await reader.read();
    if (done || !value) break;
    chunks.push(value);
    total += value.length;
  }
  await reader.cancel().catch(() => {});
  return new TextDecoder("utf-8").decode(Buffer.concat(chunks));
}

async function fetchHtml(start: URL) {
  let current = start;
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    await assertPublicUrl(current);
    const res = await fetch(current, {
      redirect: "manual",
      signal: AbortSignal.timeout(6000),
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; Verlanglijstje/1.0; +https://github.com/StudioSowieso/verlanglijstje)",
        accept: "text/html,application/xhtml+xml",
        "accept-language": "nl,en;q=0.8",
      },
    });
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) throw new Error("Redirect zonder adres");
      current = new URL(location, current);
      continue;
    }
    if (!res.ok) throw new Error(`Pagina gaf status ${res.status}`);
    const type = res.headers.get("content-type") ?? "";
    if (!type.includes("html")) throw new Error("Geen webpagina");
    return { html: await readLimited(res), finalUrl: current };
  }
  throw new Error("Te veel redirects");
}

function decodeEntities(value: string) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, h) =>
      String.fromCodePoint(Number.parseInt(h, 16)),
    )
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function readMeta(html: string) {
  const meta = new Map<string, string>();
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const attrs = new Map<string, string>();
    for (const m of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
      attrs.set(m[1].toLowerCase(), m[2] ?? m[3] ?? "");
    }
    const key = (attrs.get("property") ?? attrs.get("name"))?.toLowerCase();
    const content = attrs.get("content");
    if (key && content && !meta.has(key)) {
      meta.set(key, decodeEntities(content).trim());
    }
  }
  return meta;
}

function findJsonLdPrice(html: string): { amount?: string; currency?: string } {
  const blocks = html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  );
  for (const block of blocks) {
    try {
      const found = walkForOffer(JSON.parse(block[1]));
      if (found) return found;
    } catch {
      // ongeldige JSON-LD negeren
    }
  }
  return {};
}

function walkForOffer(
  node: unknown,
): { amount?: string; currency?: string } | undefined {
  if (!node || typeof node !== "object") return undefined;
  if (Array.isArray(node)) {
    for (const item of node) {
      const found = walkForOffer(item);
      if (found) return found;
    }
    return undefined;
  }
  const obj = node as Record<string, unknown>;
  const price = obj.price ?? obj.lowPrice;
  if (
    (typeof price === "string" || typeof price === "number") &&
    price !== ""
  ) {
    const currency =
      typeof obj.priceCurrency === "string" ? obj.priceCurrency : undefined;
    return { amount: String(price), currency };
  }
  for (const value of Object.values(obj)) {
    const found = walkForOffer(value);
    if (found) return found;
  }
  return undefined;
}

export function formatPrice(amount?: string, currency?: string) {
  if (!amount) return undefined;
  const number = Number(amount.replace(",", "."));
  const text = Number.isFinite(number)
    ? number.toLocaleString("nl-NL", {
        minimumFractionDigits: Number.isInteger(number) ? 0 : 2,
        maximumFractionDigits: 2,
      })
    : amount;
  const symbol = currency === "EUR" || !currency ? "€" : `${currency} `;
  return `${symbol} ${text}`.replace("€  ", "€ ").trim();
}

function titleFromSlug(url: URL) {
  const slug = [...url.pathname.split("/").filter(Boolean)]
    .reverse()
    .find((part) => /[a-z]{3,}/i.test(part) && !/^\d+$/.test(part));
  if (!slug) return undefined;
  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug);
  } catch {
    // ongeldige codering laten staan
  }
  const words = decoded
    .replace(/\.[a-z0-9]{2,5}$/i, "")
    .split(/[-_+]+/)
    .filter(Boolean);
  if (words.length < 2) return undefined;
  const text = words.join(" ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export async function getLinkPreview(rawUrl: string): Promise<LinkPreview> {
  const start = new URL(rawUrl);

  let page: Awaited<ReturnType<typeof fetchHtml>>;
  try {
    page = await fetchHtml(start);
  } catch (error) {
    // Sommige winkels weigeren automatische bezoekers. Dan is de naam in
    // de link vaak nog bruikbaar.
    const title = titleFromSlug(start);
    if (title) return { title: title.slice(0, 200), partial: true };
    throw error;
  }
  const { html, finalUrl } = page;
  const meta = readMeta(html);
  const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];

  const title =
    meta.get("og:title") ??
    meta.get("twitter:title") ??
    (titleTag
      ? decodeEntities(titleTag).replace(/\s+/g, " ").trim()
      : undefined);

  let imageUrl: string | undefined;
  const image = meta.get("og:image") ?? meta.get("twitter:image");
  if (image) {
    try {
      const resolved = new URL(image, finalUrl);
      if (resolved.protocol === "https:" || resolved.protocol === "http:") {
        imageUrl = resolved.toString();
      }
    } catch {
      // ongeldige afbeelding-url negeren
    }
  }

  const ld = findJsonLdPrice(html);
  const price = formatPrice(
    meta.get("og:price:amount") ??
      meta.get("product:price:amount") ??
      ld.amount,
    meta.get("og:price:currency") ??
      meta.get("product:price:currency") ??
      ld.currency,
  );

  return { title: title?.slice(0, 200), imageUrl, price };
}
