import Link from "next/link";
import { LISTS, type ListSlug } from "@/lib/lists";
import { cn } from "./ui";

export function ListSwitch({ current }: { current: ListSlug }) {
  return (
    <nav aria-label="Kies een lijstje">
      <ul className="inline-flex gap-1 rounded-full bg-black/25 p-1">
        {(Object.keys(LISTS) as ListSlug[]).map((slug) => (
          <li key={slug}>
            <Link
              href={`/${slug}`}
              aria-current={slug === current ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center rounded-full px-5 text-base font-bold transition-colors",
                slug === current
                  ? "bg-gold text-ink"
                  : "text-cream hover:bg-white/10",
              )}
            >
              {LISTS[slug].name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
