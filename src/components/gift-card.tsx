import { ExternalLink, Gift as GiftIcon } from "lucide-react";
import { ClaimForm } from "./claim-form";
import { TagHole } from "./decor";
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
        "paper relative mt-12 flex flex-col gap-4 rounded-b-3xl rounded-t-[2.75rem] px-4 pb-4 pt-12 shadow-[0_10px_0_rgb(0_0_0/0.18)]",
        dimmed && "opacity-85",
      )}
    >
      <TagHole />

      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-white/60">
        {gift.imageUrl ? (
          // biome-ignore lint/performance/noImgElement: externe webshop-plaatjes, domeinen onbekend
          <img
            src={gift.imageUrl}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            className={cn(
              "h-full w-full object-contain p-2",
              dimmed && "grayscale",
            )}
          />
        ) : (
          <GiftIcon size={52} className="text-sprig" aria-hidden="true" />
        )}
        {gift.price ? (
          <span className="absolute right-2 top-2 rounded-full bg-red px-3 py-1 text-sm font-bold text-paper shadow-[2px_2px_0_var(--color-pink)]">
            {gift.price}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <h3
          className={cn(
            "text-2xl font-extrabold leading-tight tracking-tight",
            dimmed && "line-through decoration-red decoration-[3px]",
          )}
        >
          {gift.title}
        </h3>

        {gift.note ? (
          <p className="whitespace-pre-line text-base text-ink/85">
            {gift.note}
          </p>
        ) : null}

        {gift.url ? (
          <a
            href={gift.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 w-fit items-center gap-2 text-base font-bold text-red underline underline-offset-4 hover:text-red-deep"
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
