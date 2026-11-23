import Link from "next/link";
import { LISTS, type ListSlug } from "@/lib/lists";
import { cn } from "./ui";

export function ListSwitch({ current }: { current: ListSlug }) {
  return (
    <nav aria-label="Kies een lijstje">
      <ul className="inline-flex gap-1 rounded-full bg-forest-deep/70 p-1.5">
        {(Object.keys(LISTS) as ListSlug[]).map((slug) => (
          <li key={slug}>
            <Link
              href={`/${slug}`}
              aria-current={slug === current ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center rounded-full px-6 text-base font-bold transition-colors",
                slug === current
                  ? "bg-red text-paper shadow-[3px_3px_0_var(--color-pink)]"
                  : "text-paper hover:bg-paper/10",
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
