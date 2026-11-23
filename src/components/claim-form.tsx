"use client";

import { Gift, Undo2 } from "lucide-react";
import { useActionState, useEffect } from "react";
import { claimGift, unclaimGift } from "@/app/actions";
import { fireConfetti } from "./confetti";
import { Button, Input } from "./ui";

export function ClaimForm({
  list,
  id,
  claimed,
  claimedBy,
}: {
  list: string;
  id: number;
  claimed: boolean;
  claimedBy: string | null;
}) {
  const [state, action, pending] = useActionState(claimGift, {});

  useEffect(() => {
    if (state.ok) void fireConfetti();
  }, [state]);

  if (claimed) {
    return (
      <div className="flex flex-col gap-2">
        <p className="rounded-xl bg-leaf/15 px-3 py-2 text-base font-bold text-leaf">
          Al gekocht{claimedBy ? ` door ${claimedBy}` : ""}
        </p>
        <form action={unclaimGift}>
          <input type="hidden" name="list" value={list} />
          <input type="hidden" name="id" value={id} />
          <Button type="submit" variant="ghost" className="w-full">
            <Undo2 size={16} aria-hidden="true" /> Toch niet
          </Button>
        </form>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="list" value={list} />
      <input type="hidden" name="id" value={id} />
      <label htmlFor={`buyer-${id}`} className="sr-only">
        Jouw naam (niet verplicht)
      </label>
      <Input
        id={`buyer-${id}`}
        name="buyer"
        placeholder="Jouw naam (niet verplicht)"
        maxLength={60}
        autoComplete="off"
      />
      <Button type="submit" variant="red" disabled={pending}>
        <Gift size={16} aria-hidden="true" />
        {pending ? "Even geduld…" : "Ik koop dit"}
      </Button>
      {state.error ? (
        <p role="alert" className="text-sm font-bold text-red">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
