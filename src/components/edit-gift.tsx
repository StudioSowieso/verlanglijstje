"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { deleteGift } from "@/app/actions";
import { GiftForm } from "./gift-form";
import { Button } from "./ui";

type GiftValues = {
  id: number;
  title: string;
  url: string | null;
  imageUrl: string | null;
  price: string | null;
  note: string | null;
};

export function EditGift({ list, gift }: { list: string; gift: GiftValues }) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const done = useCallback(() => setEditing(false), []);

  return (
    <div className="flex flex-col gap-3">
      {editing ? (
        <div className="rounded-xl border border-pine/20 bg-cream p-3">
          <GiftForm list={list} gift={gift} onDone={done} />
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="ghost"
          className="text-ink"
          onClick={() => setEditing((v) => !v)}
          aria-expanded={editing}
        >
          <Pencil size={16} aria-hidden="true" />
          {editing ? "Sluiten" : "Aanpassen"}
        </Button>
        {confirming ? (
          <form action={deleteGift} className="flex gap-2">
            <input type="hidden" name="list" value={list} />
            <input type="hidden" name="id" value={gift.id} />
            <Button type="submit" variant="berry">
              Echt verwijderen
            </Button>
            <Button
              variant="ghost"
              className="text-ink"
              onClick={() => setConfirming(false)}
            >
              Nee
            </Button>
          </form>
        ) : (
          <Button variant="danger" onClick={() => setConfirming(true)}>
            <Trash2 size={16} aria-hidden="true" /> Verwijderen
          </Button>
        )}
      </div>
    </div>
  );
}
