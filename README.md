# Kerst-verlanglijstjes

Twee verlanglijstjes (`/sander` en `/sabien`). Bezoekers strepen af wat ze kopen,
de eigenaar van een lijstje ziet niet wat is afgestreept.

## Stack

Next.js, TypeScript, Tailwind, Neon (Postgres) met Drizzle, Zod, tsParticles,
Lucide, Biome. Draait op Vercel.

## Omgevingsvariabelen

| Naam | Waarvoor |
|---|---|
| `DATABASE_URL` | Neon connection string (ook nodig tijdens de build) |
| `SANDER_PIN` | Code om Sanders lijstje aan te passen |
| `SABIEN_PIN` | Code om Sabiens lijstje aan te passen |
| `BOL_CLIENT_ID` / `BOL_CLIENT_SECRET` | Optioneel. Voor bol.com-links: titel, plaatje en prijs via de bol Marketing Catalog API. Zonder deze twee valt de tool terug op de naam uit de link. |

Zie `.env.example`. Zet ze lokaal in `.env.local` en in Vercel onder
Settings > Environment Variables. Kies zelf lange codes: iedereen die de link
kent kan het invoerveld proberen.

## Database

Het schema staat in `src/db/schema.ts`, migraties in `drizzle/`.

```bash
npm run db:generate   # nieuwe migratie maken na een schemawijziging
npm run db:migrate    # migraties toepassen op DATABASE_URL
```

De eerste migratie (tabel `gifts`) is al toegepast op het Neon-project
`kerst-cadeaulijst`.

## Lokaal draaien

```bash
npm install
npm run dev
```

## Hoe het werkt

- Eigenaarsmodus: de PIN wordt server-side gecontroleerd en zet een
  httpOnly-cookie per lijst. In die modus worden de afgestreept-gegevens niet
  eens uit de database gehaald.
- Link plakken: de server haalt de pagina op en leest Open Graph-gegevens
  (titel, plaatje, prijs). Interne adressen, vreemde poorten en redirects
  daarheen worden geblokkeerd. Lukt het niet, dan vul je het zelf in.
- Animaties (sneeuw, confetti, lichtjes) staan uit bij `prefers-reduced-motion`.
