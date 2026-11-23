"use client";

import { KeyRound } from "lucide-react";
import { useActionState } from "react";
import { ownerLogin } from "@/app/actions";
import { Button, Input } from "./ui";

export function OwnerLogin({ list, name }: { list: string; name: string }) {
  const [state, action, pending] = useActionState(ownerLogin, {});

  return (
    <details className="group">
      <summary
        aria-label={`Inloggen als ${name}`}
        title={`Inloggen als ${name}`}
        className="grid size-11 cursor-pointer list-none place-items-center rounded-full text-paper/40 transition-colors hover:bg-forest-deep/70 hover:text-paper group-open:bg-forest-deep/70 group-open:text-paper [&::-webkit-details-marker]:hidden"
      >
        <KeyRound size={16} aria-hidden="true" />
      </summary>
      <form
        action={action}
        className="absolute left-1/2 top-full z-20 mt-2 flex w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 flex-col gap-2 rounded-2xl bg-forest-deep p-4 shadow-[0_8px_0_rgb(0_0_0/0.25)]"
      >
        <input type="hidden" name="list" value={list} />
        <label htmlFor="pin" className="text-sm font-bold">
          Code van {name}
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
