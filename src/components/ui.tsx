import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

type Variant = "gold" | "berry" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  gold: "bg-gold text-ink hover:bg-[#f6d374] border-gold-deep",
  berry: "bg-berry text-cream hover:bg-berry-dark border-berry-dark",
  ghost: "bg-transparent text-current hover:bg-black/10 border-current/40",
  danger: "bg-transparent text-berry hover:bg-berry/10 border-berry/50",
};

export function Button({
  variant = "gold",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-5 py-2 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      )}
    />
  );
}

const fieldClass =
  "w-full rounded-xl border-2 border-pine/25 bg-white px-3 py-2 text-base text-ink placeholder:text-ink/55 focus:border-berry";

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
