import { ExternalLink, Gift as GiftIcon } from "lucide-react";
import { ClaimForm } from "./claim-form";
import { EditGift } from "./edit-gift";
import { cn } from "./ui";

export type GiftView = {
  id: number;
  title: string;
  url: string | null;
  imageUrl: string | null;
  price: string | null;
  note: string | null;
  claimed: boolean;
  claimedBy: string | null;
};

export function GiftCard({
  gift,
  list,
  owner,
}: {
  gift: GiftView;
  list: string;
  owner: boolean;
}) {
  const dimmed = !owner && gift.claimed;

  return (
    <li
      className={cn(
        "gift-card flex flex-col overflow-hidden rounded-2xl bg-paper text-ink shadow-lg",
        dimmed && "opacity-80",
      )}
    >
      <div className="relative flex aspect-[4/3] items-center justify-center bg-cream">
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2 w-3.5 -translate-x-1/2 bg-berry/90"
        />
        {gift.imageUrl ? (
          // biome-ignore lint/performance/noImgElement: externe webshop-plaatjes, domeinen onbekend
          <img
            src={gift.imageUrl}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            className={cn(
              "relative h-full w-full object-contain p-2",
              dimmed && "grayscale",
            )}
          />
        ) : (
          <GiftIcon
            size={56}
            className="relative text-berry"
            aria-hidden="true"
          />
        )}
        {gift.price ? (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-gold px-3 py-1 text-sm font-bold text-ink shadow">
            {gift.price}
          </span>
        ) : null}
      </div>

      <div className="relative z-10 flex flex-1 flex-col gap-3 bg-paper p-4">
        <h3
          className={cn(
            "font-display text-2xl font-bold leading-tight",
            dimmed && "line-through decoration-berry decoration-2",
          )}
        >
          {gift.title}
        </h3>

        {gift.note ? (
          <p className="whitespace-pre-line text-sm text-ink/85">{gift.note}</p>
        ) : null}

        {gift.url ? (
          <a
            href={gift.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-bold text-berry underline underline-offset-4 hover:text-berry-dark"
          >
            <ExternalLink size={16} aria-hidden="true" /> Bekijk in de winkel
            <span className="sr-only"> (opent in een nieuw tabblad)</span>
          </a>
        ) : null}

        <div className="mt-auto pt-1">
          {owner ? (
            <EditGift
              list={list}
              gift={{
                id: gift.id,
                title: gift.title,
                url: gift.url,
                imageUrl: gift.imageUrl,
                price: gift.price,
                note: gift.note,
              }}
            />
          ) : (
            <ClaimForm
              list={list}
              id={gift.id}
              claimed={gift.claimed}
              claimedBy={gift.claimedBy}
            />
          )}
        </div>
      </div>
    </li>
  );
}
