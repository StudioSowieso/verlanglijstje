// Productgegevens van bol.com via de officiële Marketing Catalog API
// (partnerprogramma). bol.com blokkeert gewone pagina-verzoeken vanaf
// servers, deze API is de bedoelde route.
// Docs: https://api.bol.com/marketing/docs/catalog-api/index.html

const API = "https://api.bol.com/marketing/catalog/v1";
const TOKEN_URL = "https://login.bol.com/token?grant_type=client_credentials";

export type BolProduct = {
  title?: string;
  imageUrl?: string;
  price?: number;
};

let cachedToken: { value: string; expiresAt: number } | undefined;

export function isBolConfigured() {
  return Boolean(process.env.BOL_CLIENT_ID && process.env.BOL_CLIENT_SECRET);
}

/** Geeft het bol-productnummer uit een productlink, of undefined. */
export function bolProductId(url: URL) {
  if (url.hostname !== "bol.com" && !url.hostname.endsWith(".bol.com")) {
    return undefined;
  }
  return url.pathname.match(/\/p\/[^/]+\/(\d{10,})/)?.[1];
}

async function getToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 15_000) {
    return cachedToken.value;
  }
  const credentials = Buffer.from(
    `${process.env.BOL_CLIENT_ID}:${process.env.BOL_CLIENT_SECRET}`,
  ).toString("base64");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      authorization: `Basic ${credentials}`,
      accept: "application/json",
      "content-length": "0",
    },
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`bol-inlog mislukt (${res.status})`);
  const data = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
  };
  if (!data.access_token) throw new Error("bol gaf geen token");
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 299) * 1000,
  };
  return cachedToken.value;
}

async function bolGet(path: string, token: string, language = false) {
  const res = await fetch(`${API}${path}`, {
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/json",
      ...(language ? { "accept-language": "nl" } : {}),
    },
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`bol-API gaf status ${res.status}`);
  return res.json() as Promise<Record<string, unknown>>;
}

export async function getBolProduct(productId: string): Promise<BolProduct> {
  const token = await getToken();
  const converted = await bolGet(`/products/${productId}/to-ean`, token);
  const ean = typeof converted.ean === "string" ? converted.ean : undefined;
  if (!ean) throw new Error("Geen EAN gevonden");

  const product = (await bolGet(
    `/products/${ean}?country-code=NL&include-image=true&include-offer=true`,
    token,
    true,
  )) as {
    title?: string;
    image?: { url?: string };
    offer?: { price?: number };
  };

  return {
    title: product.title,
    imageUrl: product.image?.url,
    price:
      typeof product.offer?.price === "number"
        ? product.offer.price
        : undefined,
  };
}
