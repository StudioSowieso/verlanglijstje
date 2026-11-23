"use client";

import { Button } from "@/components/ui";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-display text-5xl font-bold text-gold">
        Oeps, er ging iets mis
      </h1>
      <p>Probeer het nog eens. Blijft het misgaan, geef het dan even door.</p>
      <Button onClick={reset}>Opnieuw proberen</Button>
    </main>
  );
}
