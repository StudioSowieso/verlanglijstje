import "@fontsource/mountains-of-christmas/latin-400.css";
import "@fontsource/mountains-of-christmas/latin-700.css";
import "@fontsource-variable/nunito/index.css";
import type { Metadata } from "next";
import { Snow } from "@/components/snow-loader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kerst-verlanglijstjes van Sander en Sabien",
  description: "Kijk wat we graag willen en strijk af wat je koopt.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nl" className="h-full">
      <body className="flex min-h-full flex-col antialiased">
        <div className="lights" aria-hidden="true">
          {Array.from({ length: 28 }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: statische decoratie
            <span key={i} />
          ))}
        </div>
        <Snow />
        <div className="relative z-10 flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
