import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-4xl font-extrabold">Dit lijstje bestaat niet</h1>
      <Link href="/" className="font-bold underline underline-offset-4">
        Terug naar de lijstjes
      </Link>
    </main>
  );
}
