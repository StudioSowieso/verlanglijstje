export const LISTS = {
  sander: { name: "Sander", pinEnv: "SANDER_PIN" },
  sabien: { name: "Sabien", pinEnv: "SABIEN_PIN" },
} as const;

export type ListSlug = keyof typeof LISTS;

export function isListSlug(value: string): value is ListSlug {
  return value in LISTS;
}
