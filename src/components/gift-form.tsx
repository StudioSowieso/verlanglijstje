"use client";

import { Link2, Plus, Save, Wand2 } from "lucide-react";
import { useActionState, useEffect, useState, useTransition } from "react";
import { addGift, previewLink, updateGift } from "@/app/actions";
import { Button, Field, Input, Textarea } from "./ui";

type GiftValues = {
  id: number;
  title: string;
  url: string | null;
  imageUrl: string | null;
  price: string | null;
  note: string | null;
};

export function GiftForm({
  list,
  gift,
  initial,
  onDone,
}: {
  list: string;
  gift?: GiftValues;
  /** Voorinvulling voor een nieuw cadeau (bijvoorbeeld via de bladwijzer) */
  initial?: Partial<Pick<GiftValues, "url" | "title" | "imageUrl" | "price">>;
  onDone?: () => void;
}) {
  const editing = Boolean(gift);
  const [state, action, pending] = useActionState(
    editing ? updateGift : addGift,
    {},
  );
  const [url, setUrl] = useState(gift?.url ?? initial?.url ?? "");
  const [title, setTitle] = useState(gift?.title ?? initial?.title ?? "");
  const [price, setPrice] = useState(gift?.price ?? initial?.price ?? "");
  const [imageUrl, setImageUrl] = useState(
    gift?.imageUrl ?? initial?.imageUrl ?? "",
  );
  const [note, setNote] = useState(gift?.note ?? "");
  const [message, setMessage] = useState("");
  const [fetching, startFetch] = useTransition();
  const idPrefix = gift ? `gift-${gift.id}` : "gift-new";

  useEffect(() => {
    if (!state.ok) return;
    if (!editing) {
      setUrl("");
      setTitle("");
      setPrice("");
      setImageUrl("");
      setNote("");
      setMessage("");
    }
    onDone?.();
  }, [state, editing, onDone]);

  function loadPreview(target: string) {
    if (!target) {
      setMessage("Plak eerst een link");
      return;
    }
    setMessage("");
    startFetch(async () => {
      const result = await previewLink(list, target);
      if (result.error) {
        setMessage(result.error);
        return;
      }
      if (result.title && !title) setTitle(result.title);
      if (result.price && !price) setPrice(result.price);
      if (result.imageUrl && !imageUrl) setImageUrl(result.imageUrl);
      if (result.partial) {
        setMessage(
          "De winkel geeft geen gegevens vrij. De naam komt uit de link, vul plaatje en prijs zelf in.",
        );
        return;
      }
      setMessage(
        result.title || result.imageUrl
          ? "Gegevens opgehaald, controleer ze even"
          : "Niets gevonden op die pagina, vul het zelf in",
      );
    });
  }

  return (
    <form action={action} className="flex flex-col gap-3 text-ink">
      <input type="hidden" name="list" value={list} />
      {gift ? <input type="hidden" name="id" value={gift.id} /> : null}

      <Field label="Link naar het cadeau" htmlFor={`${idPrefix}-url`}>
        <div className="flex gap-2">
          <Input
            id={`${idPrefix}-url`}
            name="url"
            type="url"
            inputMode="url"
            placeholder="https://…"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onPaste={(e) => {
              const pasted = e.clipboardData.getData("text").trim();
              if (!/^https?:\/\//i.test(pasted)) return;
              setUrl(pasted);
              e.preventDefault();
              loadPreview(pasted);
            }}
          />
          <Button
            type="button"
            variant="ghost"
            onClick={() => loadPreview(url.trim())}
            disabled={fetching}
            className="shrink-0"
          >
            <Wand2 size={16} aria-hidden="true" />
            {fetching ? "Ophalen…" : "Ophalen"}
          </Button>
        </div>
      </Field>
      <p className="text-sm text-ink/85" aria-live="polite">
        {message || "Plak een link, dan halen we titel, plaatje en prijs op."}
      </p>

      <Field label="Naam van het cadeau" htmlFor={`${idPrefix}-title`}>
        <Input
          id={`${idPrefix}-title`}
          name="title"
          required
          maxLength={200}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Prijs (niet verplicht)" htmlFor={`${idPrefix}-price`}>
          <Input
            id={`${idPrefix}-price`}
            name="price"
            maxLength={40}
            placeholder="€ 25"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Field>
        <Field
          label="Plaatje-link (niet verplicht)"
          htmlFor={`${idPrefix}-img`}
        >
          <Input
            id={`${idPrefix}-img`}
            name="imageUrl"
            type="url"
            inputMode="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </Field>
      </div>

      <Field
        label="Notitie (maat, kleur, waarom…)"
        htmlFor={`${idPrefix}-note`}
      >
        <Textarea
          id={`${idPrefix}-note`}
          name="note"
          rows={3}
          maxLength={1000}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </Field>

      {state.error ? (
        <p role="alert" className="text-sm font-bold text-red">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <output className="block text-sm font-bold text-leaf">
          Opgeslagen
        </output>
      ) : null}

      <div>
        <Button type="submit" variant="red" disabled={pending}>
          {editing ? (
            <Save size={16} aria-hidden="true" />
          ) : (
            <Plus size={16} aria-hidden="true" />
          )}
          {pending ? "Bezig…" : editing ? "Opslaan" : "Toevoegen"}
        </Button>
        {!editing ? (
          <span className="ml-3 inline-flex items-center gap-1 text-sm text-ink/70">
            <Link2 size={14} aria-hidden="true" /> Alleen de naam is verplicht
          </span>
        ) : null}
      </div>
    </form>
  );
}
