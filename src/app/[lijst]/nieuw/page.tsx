import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookmarkletForm } from "@/components/bookmarklet-form";
import { db } from "@/db";
import { gifts } from "@/db/schema";
import { isListSlug, LISTS } from "@/lib/lists";
import { isOwner } from "@/lib/owner";
import { formatPrice } from "@/lib/preview";

export const metadata: Metadata = { title: "Cadeau toevoegen" };

function first(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

function httpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

// Zelfde product, ook als de link andere volgcodes achter het vraagteken heeft
function sameProduct(a: string, b: string) {
  try {
    const x = new URL(a);
    const y = new URL(b);
    return x.origin === y.origin && x.pathname === y.pathname;
  } catch {
    return false;
  }
}

export default async function NewGiftPage({
  params,
  searchParams,
}: PageProps<"/[lijst]/nieuw">) {
  const { lijst } = await params;
  if (!isListSlug(lijst)) notFound();
  const name = LISTS[lijst].name;

  if (!(await isOwner(lijst))) {
    return (
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-10 text-center">
        <h1 className="text-3xl font-extrabold">Eerst even inloggen</h1>
        <p className="text-lg">
          Log in op het lijstje van {name} en klik daarna nog een keer op de
          bladwijzer.
        </p>
        <Link href={`/${lijst}`} className="font-bold underline">
          Naar het lijstje van {name}
        </Link>
      </main>
    );
  }

  const query = await searchParams;
  const url = httpUrl(first(query.url));
  const imageUrl = httpUrl(first(query.image));
  const priceText = first(query.price);
  const price = priceText
    ? formatPrice(priceText, first(query.currency) || undefined)
    : undefined;
  const title = first(query.title).slice(0, 200);

  const rows = await db
    .select({
      id: gifts.id,
      title: gifts.title,
      url: gifts.url,
      imageUrl: gifts.imageUrl,
      price: gifts.price,
      note: gifts.note,
    })
    .from(gifts)
    .where(eq(gifts.list, lijst));
  const existing = url
    ? rows.find((row) => row.url && sameProduct(row.url, url))
    : undefined;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <section className="paper rounded-3xl p-5 shadow-[0_10px_0_rgb(0_0_0/0.18)] sm:p-6">
        <h1 className="mb-1 text-3xl font-extrabold text-red">
          {existing ? "Cadeau bijwerken" : "Cadeau toevoegen"}
        </h1>
        <p className="mb-4 text-ink/85">
          {existing
            ? "Dit cadeau staat al op je lijstje. Je notitie blijft staan, de rest wordt bijgewerkt."
            : "Controleer de gegevens en sla ze op."}
        </p>
        <BookmarkletForm
          list={lijst}
          existing={existing}
          values={{
            url: existing?.url ?? url ?? null,
            title: title || existing?.title || "",
            imageUrl: imageUrl ?? existing?.imageUrl ?? null,
            price: price ?? existing?.price ?? null,
          }}
        />
      </section>
      <Link href={`/${lijst}`} className="text-center font-bold underline">
        Terug naar het lijstje
      </Link>
    </main>
  );
}
