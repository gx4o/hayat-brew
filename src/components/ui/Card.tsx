import type { HTMLAttributes } from "react";

/** Soft cream surface — "warm paper resting on a warmer background". */
export function Card({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-card border border-line bg-card shadow-card ${className}`}
      {...props}
    />
  );
}
