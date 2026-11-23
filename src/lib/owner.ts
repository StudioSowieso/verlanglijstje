import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { LISTS, type ListSlug } from "./lists";

const MAX_AGE = 60 * 60 * 24 * 60;

function cookieName(slug: ListSlug) {
  return `owner_${slug}`;
}

function pinFor(slug: ListSlug) {
  return process.env[LISTS[slug].pinEnv] ?? "";
}

// De PIN gecombineerd met DATABASE_URL is de sleutel, zodat het cookie
// niet offline te raden is als iemand het ooit onderschept.
function tokenFor(slug: ListSlug) {
  const pin = pinFor(slug);
  if (!pin) return "";
  return createHmac("sha256", `${pin}:${process.env.DATABASE_URL ?? ""}`)
    .update(`owner:${slug}`)
    .digest("hex");
}

function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function pinMatches(slug: ListSlug, attempt: string) {
  const pin = pinFor(slug);
  if (!pin) return false;
  return safeEqual(pin, attempt);
}

export async function isOwner(slug: ListSlug) {
  const expected = tokenFor(slug);
  if (!expected) return false;
  const store = await cookies();
  const value = store.get(cookieName(slug))?.value;
  return value ? safeEqual(value, expected) : false;
}

export async function grantOwner(slug: ListSlug) {
  const store = await cookies();
  store.set(cookieName(slug), tokenFor(slug), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function revokeOwner(slug: ListSlug) {
  const store = await cookies();
  store.delete(cookieName(slug));
}
