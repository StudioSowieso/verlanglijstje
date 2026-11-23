"use client";

import { Bookmark } from "lucide-react";
import { useEffect, useRef } from "react";

// Draait op de winkelpagina in jouw eigen browser: leest titel, plaatje en
// prijs van de pagina en opent het formulier van het lijstje, ingevuld.
function buildScript(origin: string, list: string) {
  const code = `(function(){
var d=document;
function m(n){var e=d.querySelector('meta[property="'+n+'"],meta[name="'+n+'"]');return e&&e.content||""}
var t=m("og:title")||m("twitter:title")||d.title;
var i=m("og:image")||m("twitter:image");
var p=m("product:price:amount")||m("og:price:amount");
var c=m("product:price:currency")||m("og:price:currency");
if(!p){var s=d.querySelectorAll('script[type="application/ld+json"]');
for(var k=0;k<s.length&&!p;k++){try{(function w(o){
if(!o||p||typeof o!=="object")return;
if(Array.isArray(o)){o.forEach(w);return}
var v=o.price||o.lowPrice;
if(v){p=String(v);c=o.priceCurrency||c;return}
Object.keys(o).forEach(function(x){w(o[x])})
})(JSON.parse(s[k].textContent))}catch(e){}}}
if(!p){var ip=d.querySelector('[itemprop="price"]');
if(ip)p=ip.getAttribute("content")||ip.textContent||""}
if(!i){var im=d.querySelector('link[rel="image_src"]');i=im&&im.href||""}
try{i=new URL(i,location.href).href}catch(e){}
var q=new URLSearchParams({url:location.href,title:(t||"").trim(),image:i||"",price:(p||"").trim(),currency:c||""});
window.open(${JSON.stringify(origin)}+"/"+${JSON.stringify(list)}+"/nieuw?"+q.toString(),"_blank")
})();`;
  return `javascript:${encodeURIComponent(code.replace(/\n/g, ""))}`;
}

export function Bookmarklet({ list, name }: { list: string; name: string }) {
  const link = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // React laat javascript:-links niet toe in JSX, daarom zo.
    link.current?.setAttribute(
      "href",
      buildScript(window.location.origin, list),
    );
  }, [list]);

  return (
    <details className="rounded-xl border-2 border-ink/20 bg-white/50 p-3 text-ink">
      <summary className="flex min-h-11 cursor-pointer items-center gap-2 font-bold">
        <Bookmark size={16} aria-hidden="true" /> Bladwijzer voor je computer
      </summary>
      <div className="flex flex-col gap-3 pt-2 text-base">
        <p>
          Sommige winkels, zoals bol.com, laten ons de pagina niet ophalen. Met
          deze bladwijzer lees je de pagina zelf uit, in je eigen browser.
        </p>
        <ol className="list-decimal pl-5">
          <li>
            Sleep deze knop naar je bladwijzerbalk:{" "}
            <a
              ref={link}
              href={`/${list}`}
              onClick={(e) => e.preventDefault()}
              className="inline-flex min-h-11 items-center rounded-full border-2 border-red bg-red px-4 font-bold text-paper"
            >
              Op lijstje van {name}
            </a>
          </li>
          <li>Open een product in de winkel.</li>
          <li>Klik op de bladwijzer. Het cadeau staat ingevuld klaar.</li>
        </ol>
        <p className="text-sm text-ink/80">
          Staat het cadeau al op je lijstje met dezelfde link, dan werkt de
          bladwijzer dat cadeau bij in plaats van een tweede te maken.
        </p>
      </div>
    </details>
  );
}
