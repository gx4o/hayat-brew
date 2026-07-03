import Link from "next/link";
import type { ReactNode } from "react";

/** Large tappable choice card used across the brew flow. */
export function OptionCard({
  href,
  title,
  subtitle,
  visual,
}: {
  href: string;
  title: string;
  subtitle?: string;
  visual: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-4 rounded-card border border-line bg-card p-6 pb-7 text-center shadow-card transition-all duration-200 hover:shadow-[0_8px_24px_rgba(75,46,43,0.12)] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 sm:p-8"
    >
      <div className="flex h-32 w-32 items-center justify-center sm:h-40 sm:w-40">
        {visual}
      </div>
      <div>
        <span className="block text-2xl font-bold sm:text-3xl">{title}</span>
        {subtitle ? (
          <span className="mt-1 block text-base text-muted">{subtitle}</span>
        ) : null}
      </div>
    </Link>
  );
}
