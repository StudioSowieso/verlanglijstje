import Link from "next/link";
import { Sparkle, Starburst, TagHole } from "@/components/decor";
import { LISTS, type ListSlug } from "@/lib/lists";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-12 px-4 py-16 text-center">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-balance text-4xl font-extrabold leading-tight sm:text-5xl">
          Kerst-verlanglijstjes
        </h1>
        <p className="max-w-md text-lg text-paper/90">
          Kies een lijstje, bekijk wat we graag willen en strijk af wat je
          koopt.
        </p>
      </div>

      <ul className="grid w-full gap-x-8 gap-y-14 sm:grid-cols-2">
        {(Object.keys(LISTS) as ListSlug[]).map((slug, index) => (
          <li key={slug} className={index === 1 ? "sm:mt-8" : undefined}>
            <Link
              href={`/${slug}`}
              className="paper tag-arch swing relative mx-auto flex min-h-80 w-full max-w-xs flex-col items-center justify-center gap-3 px-6 pb-10 pt-20 shadow-[0_12px_0_rgb(0_0_0/0.2)]"
              style={{ animationDelay: `${0.15 + index * 0.25}s` }}
            >
              <TagHole />
              <span className="text-lg font-semibold">Verlanglijstje van</span>
              <span className="extrude text-6xl font-extrabold uppercase leading-none">
                {LISTS[slug].name}
              </span>
              <span className="mt-2 font-bold text-leaf underline underline-offset-4">
                Bekijk het lijstje
              </span>
              <Sparkle size={22} className="absolute bottom-6 left-7" />
              <Sparkle size={18} className="absolute bottom-10 right-8" />
              <Starburst
                size={64}
                flip={index === 1}
                className="absolute -right-4 -top-4"
              />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
