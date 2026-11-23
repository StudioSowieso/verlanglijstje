"use client";

import { KeyRound } from "lucide-react";
import { useActionState } from "react";
import { ownerLogin } from "@/app/actions";
import { Button, Input } from "./ui";

export function OwnerLogin({ list, name }: { list: string; name: string }) {
  const [state, action, pending] = useActionState(ownerLogin, {});

  return (
    <details className="max-w-md rounded-2xl bg-forest-deep/70 px-4 py-2">
      <summary className="flex min-h-11 cursor-pointer items-center gap-2 text-base font-bold">
        <KeyRound size={16} aria-hidden="true" /> Ik ben {name}, ik wil mijn
        lijstje aanpassen
      </summary>
      <form action={action} className="flex flex-col gap-2 pb-2 pt-3">
        <input type="hidden" name="list" value={list} />
        <label htmlFor="pin" className="text-sm font-bold">
          Jouw code
        </label>
        <div className="flex gap-2">
          <Input
            id="pin"
            name="pin"
            type="password"
            required
            autoComplete="current-password"
          />
          <Button type="submit" disabled={pending}>
            {pending ? "Even…" : "Open"}
          </Button>
        </div>
        {state.error ? (
          <p role="alert" className="text-sm font-bold text-blush">
            {state.error}
          </p>
        ) : null}
      </form>
    </details>
  );
}
