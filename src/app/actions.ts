"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { gifts } from "@/db/schema";
import { isListSlug, type ListSlug } from "@/lib/lists";
import { grantOwner, isOwner, pinMatches, revokeOwner } from "@/lib/owner";
import { getLinkPreview, type LinkPreview } from "@/lib/preview";

export type FormState = { ok?: boolean; error?: string };

const emptyToUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

const optionalText = (max: number) =>
  z.preprocess(emptyToUndefined, z.string().trim().max(max).optional());

const optionalUrl = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .trim()
    .max(2000)
    .refine(
      (v) => /^https?:\/\//i.test(v),
      "Gebruik een link die met http(s) begint",
    )
    .optional(),
);

const giftSchema = z.object({
  title: z.string().trim().min(1, "Geef het cadeau een naam").max(200),
  url: optionalUrl,
  imageUrl: optionalUrl,
  price: optionalText(40),
  note: optionalText(1000),
});

function slugFrom(value: FormDataEntryValue | null): ListSlug {
  if (typeof value !== "string" || !isListSlug(value)) {
    throw new Error("Onbekende lijst");
  }
  return value;
}

function parseGift(formData: FormData) {
  return giftSchema.safeParse({
    title: formData.get("title"),
    url: formData.get("url"),
    imageUrl: formData.get("imageUrl"),
    price: formData.get("price"),
    note: formData.get("note"),
  });
}

async function requireOwner(slug: ListSlug) {
  if (!(await isOwner(slug))) {
    throw new Error("Geen toegang");
  }
}

export async function ownerLogin(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const slug = slugFrom(formData.get("list"));
  const pin = String(formData.get("pin") ?? "");
  if (!pinMatches(slug, pin)) {
    // Kleine vertraging tegen snel proberen.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { error: "Die code klopt niet" };
  }
  await grantOwner(slug);
  revalidatePath(`/${slug}`);
  return { ok: true };
}

export async function ownerLogout(formData: FormData) {
  const slug = slugFrom(formData.get("list"));
  await revokeOwner(slug);
  revalidatePath(`/${slug}`);
}

export async function previewLink(
  slugValue: string,
  url: string,
): Promise<LinkPreview & { error?: string }> {
  if (!isListSlug(slugValue)) return { error: "Onbekende lijst" };
  if (!(await isOwner(slugValue))) return { error: "Geen toegang" };
  const parsed = optionalUrl.safeParse(url);
  if (!parsed.success || !parsed.data) {
    return { error: "Dat lijkt geen geldige link" };
  }
  try {
    return await getLinkPreview(parsed.data);
  } catch {
    return { error: "Kon de pagina niet ophalen, vul de gegevens zelf in" };
  }
}

export async function addGift(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const slug = slugFrom(formData.get("list"));
  await requireOwner(slug);
  const parsed = parseGift(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Controleer de invoer" };
  }
  await db.insert(gifts).values({ list: slug, ...parsed.data });
  revalidatePath(`/${slug}`);
  return { ok: true };
}

export async function updateGift(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const slug = slugFrom(formData.get("list"));
  await requireOwner(slug);
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return { error: "Onbekend cadeau" };
  const parsed = parseGift(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Controleer de invoer" };
  }
  await db
    .update(gifts)
    .set({
      title: parsed.data.title,
      url: parsed.data.url ?? null,
      imageUrl: parsed.data.imageUrl ?? null,
      price: parsed.data.price ?? null,
      note: parsed.data.note ?? null,
    })
    .where(and(eq(gifts.id, id), eq(gifts.list, slug)));
  revalidatePath(`/${slug}`);
  return { ok: true };
}

export async function deleteGift(formData: FormData) {
  const slug = slugFrom(formData.get("list"));
  await requireOwner(slug);
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await db.delete(gifts).where(and(eq(gifts.id, id), eq(gifts.list, slug)));
  revalidatePath(`/${slug}`);
}

const claimSchema = z.object({
  id: z.coerce.number().int(),
  buyer: optionalText(60),
});

// Bezoekers: cadeau afstrepen. De eigenaar van de lijst kan dit niet,
// zodat het een verrassing blijft.
export async function claimGift(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const slug = slugFrom(formData.get("list"));
  if (await isOwner(slug)) {
    return { error: "Je kunt je eigen lijstje niet afstrepen" };
  }
  const parsed = claimSchema.safeParse({
    id: formData.get("id"),
    buyer: formData.get("buyer"),
  });
  if (!parsed.success) return { error: "Controleer de invoer" };
  const updated = await db
    .update(gifts)
    .set({
      claimed: true,
      claimedBy: parsed.data.buyer ?? null,
      claimedAt: new Date(),
    })
    .where(
      and(
        eq(gifts.id, parsed.data.id),
        eq(gifts.list, slug),
        eq(gifts.claimed, false),
      ),
    )
    .returning({ id: gifts.id });
  revalidatePath(`/${slug}`);
  if (updated.length === 0) {
    return { error: "Iemand anders was je net voor" };
  }
  return { ok: true };
}

export async function unclaimGift(formData: FormData) {
  const slug = slugFrom(formData.get("list"));
  if (await isOwner(slug)) return;
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await db
    .update(gifts)
    .set({ claimed: false, claimedBy: null, claimedAt: null })
    .where(and(eq(gifts.id, id), eq(gifts.list, slug)));
  revalidatePath(`/${slug}`);
}
