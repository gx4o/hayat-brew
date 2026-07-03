import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "tertiary";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-accent text-card hover:bg-accent-deep active:scale-[0.98] shadow-[0_2px_8px_rgba(192,133,82,0.35)]",
  secondary:
    "bg-card text-foreground border border-line hover:border-accent/40 active:scale-[0.98]",
  tertiary: "text-muted hover:text-foreground",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-lg font-medium transition-all duration-150 motion-reduce:transition-none motion-reduce:active:scale-100";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`${BASE} ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  href,
  children,
}: {
  variant?: Variant;
  className?: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={`${BASE} ${VARIANT_CLASSES[variant]} ${className}`}>
      {children}
    </Link>
  );
}
