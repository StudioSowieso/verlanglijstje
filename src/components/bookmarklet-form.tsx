"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { GiftForm } from "./gift-form";

type Values = {
  url: string | null;
  title: string;
  imageUrl: string | null;
  price: string | null;
};

export function BookmarkletForm({
  list,
  existing,
  values,
}: {
  list: string;
  existing?: ({ id: number; note: string | null } & Values) | undefined;
  values: Values;
}) {
  const router = useRouter();
  const done = useCallback(() => router.push(`/${list}`), [router, list]);

  return existing ? (
    <GiftForm list={list} gift={{ ...existing, ...values }} onDone={done} />
  ) : (
    <GiftForm list={list} initial={values} onDone={done} />
  );
}
