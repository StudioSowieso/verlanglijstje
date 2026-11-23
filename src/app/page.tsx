import { Gift } from "lucide-react";
import Link from "next/link";
import { LISTS, type ListSlug } from "@/lib/lists";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-10 px-4 py-12 text-center">
      <div className="flex flex-col gap-3">
        <h1 className="font-display text-6xl font-bold text-gold sm:text-7xl">
          Kerst-verlanglijstjes
        </h1>
        <p className="text-lg text-cream/90">
          Kies een lijstje, bekijk wat we graag willen en strijk af wat je
          koopt.
        </p>
      </div>
      <ul className="grid w-full gap-5 sm:grid-cols-2">
        {(Object.keys(LISTS) as ListSlug[]).map((slug) => (
          <li key={slug}>
            <Link
              href={`/${slug}`}
              className="gift-card flex min-h-44 flex-col items-center justify-center gap-3 rounded-3xl bg-paper p-6 text-ink shadow-xl"
            >
              <Gift size={44} className="text-berry" aria-hidden="true" />
              <span className="font-display text-4xl font-bold text-berry">
                {LISTS[slug].name}
              </span>
              <span className="text-sm font-bold text-ink/80">
                Bekijk het lijstje
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
