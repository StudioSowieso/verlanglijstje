import "@fontsource-variable/outfit/index.css";
import type { Metadata } from "next";
import { Backdrop } from "@/components/decor";
import { Snow } from "@/components/snow-loader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kerst-verlanglijstjes van Sander en Sabien",
  description: "Bekijk wat we graag willen en streep af wat je koopt.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nl" className="h-full">
      <body className="flex min-h-full flex-col antialiased">
        <Backdrop />
        <Snow />
        <div className="relative z-10 flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
