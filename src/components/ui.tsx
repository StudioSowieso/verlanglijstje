import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

type Variant = "red" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  red: "border-red-deep bg-red text-paper shadow-[3px_3px_0_var(--color-pink)] hover:bg-red-deep active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_var(--color-pink)]",
  ghost: "border-ink/70 bg-transparent text-ink hover:bg-ink/10",
  danger: "border-red bg-transparent text-red hover:bg-red/10",
};

export function Button({
  variant = "red",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 px-5 py-2 text-sm font-bold transition-[background-color,transform,box-shadow] disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      )}
    />
  );
}

const fieldClass =
  "w-full rounded-xl border-2 border-ink/40 bg-white/70 px-3 py-2 text-base text-ink placeholder:text-ink/70 focus:border-red";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(fieldClass, "min-h-11", className)} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(fieldClass, className)} />;
}

export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-sm font-bold text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}
