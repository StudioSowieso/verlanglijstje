import { asc, eq } from "drizzle-orm";
import { LogOut } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ownerLogout } from "@/app/actions";
import { GiftCard, type GiftView } from "@/components/gift-card";
import { GiftForm } from "@/components/gift-form";
import { ListSwitch } from "@/components/list-switch";
import { OwnerLogin } from "@/components/owner-login";
import { Button } from "@/components/ui";
import { db } from "@/db";
import { gifts } from "@/db/schema";
import { isListSlug, LISTS, type ListSlug } from "@/lib/lists";
import { isOwner } from "@/lib/owner";

export async function generateMetadata({
  params,
}: PageProps<"/[lijst]">): Promise<Metadata> {
  const { lijst } = await params;
  if (!isListSlug(lijst)) return {};
  return { title: `Verlanglijstje van ${LISTS[lijst].name}` };
}

async function getGifts(slug: ListSlug, owner: boolean): Promise<GiftView[]> {
  const base = {
    id: gifts.id,
    title: gifts.title,
    url: gifts.url,
    imageUrl: gifts.imageUrl,
    price: gifts.price,
    note: gifts.note,
  };
  if (owner) {
    // De eigenaar krijgt de afgestreept-gegevens nooit te zien: verrassing!
    const rows = await db
      .select(base)
      .from(gifts)
      .where(eq(gifts.list, slug))
      .orderBy(asc(gifts.createdAt));
    return rows.map((row) => ({ ...row, claimed: false, claimedBy: null }));
  }
  return db
    .select({ ...base, claimed: gifts.claimed, claimedBy: gifts.claimedBy })
    .from(gifts)
    .where(eq(gifts.list, slug))
    .orderBy(asc(gifts.createdAt));
}

export default async function ListPage({ params }: PageProps<"/[lijst]">) {
  const { lijst } = await params;
  if (!isListSlug(lijst)) notFound();

  const name = LISTS[lijst].name;
  const owner = await isOwner(lijst);
  const items = await getGifts(lijst, owner);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
      <header className="flex flex-col items-center gap-4 text-center">
        <ListSwitch current={lijst} />
        <h1 className="font-display text-5xl font-bold text-gold sm:text-6xl">
          Verlanglijstje van {name}
        </h1>
        <p className="max-w-xl text-lg text-cream/90">
          {owner
            ? "Je bekijkt je eigen lijstje. Wat al gekocht is zie je niet, dat blijft een verrassing."
            : `Strijk af wat je voor ${name} koopt, dan krijgt ${name} het niet dubbel.`}
        </p>
      </header>

      {owner ? (
        <section
          aria-labelledby="toevoegen"
          className="mx-auto w-full max-w-2xl rounded-3xl bg-paper p-5 shadow-xl"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2
              id="toevoegen"
              className="font-display text-3xl font-bold text-berry"
            >
              Cadeau toevoegen
            </h2>
            <form action={ownerLogout}>
              <input type="hidden" name="list" value={lijst} />
              <Button type="submit" variant="ghost" className="text-ink">
                <LogOut size={16} aria-hidden="true" /> Klaar met bewerken
              </Button>
            </form>
          </div>
          <GiftForm list={lijst} />
        </section>
      ) : (
        <div className="flex justify-center">
          <OwnerLogin list={lijst} name={name} />
        </div>
      )}

      <section aria-label={`Cadeaus voor ${name}`}>
        {items.length === 0 ? (
          <p className="mx-auto max-w-md rounded-2xl bg-pine-soft/60 p-6 text-center text-lg">
            {owner
              ? "Nog niks op je lijstje. Plak hierboven een link om te beginnen."
              : `${name} heeft nog niks op het lijstje gezet.`}
          </p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((gift) => (
              <GiftCard key={gift.id} gift={gift} list={lijst} owner={owner} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
