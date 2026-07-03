"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MIN_QUANTITY } from "@/lib/recipe-engine";

const STEP = 0.5;
const MAX = 12;

export function QuantityPicker({
  resultHref,
  initial,
}: {
  /** Result URL without the qty param — it gets appended here. */
  resultHref: string;
  initial: number;
}) {
  const router = useRouter();
  const [qty, setQty] = useState(initial);

  const change = (delta: number) =>
    setQty((q) => Math.min(MAX, Math.max(MIN_QUANTITY, Math.round((q + delta) * 2) / 2)));

  return (
    <div className="mt-10 flex flex-col items-center">
      <div className="flex items-center gap-7 sm:gap-10">
        <button
          type="button"
          aria-label="نقّص"
          onClick={() => change(-STEP)}
          disabled={qty <= MIN_QUANTITY}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-line bg-card text-3xl font-bold text-foreground shadow-card transition-all active:scale-95 disabled:opacity-35 disabled:active:scale-100 motion-reduce:transition-none sm:h-18 sm:w-18"
        >
          −
        </button>

        <div className="w-36 text-center sm:w-44">
          <span
            key={qty}
            className="qty-pop inline-block font-display text-7xl font-bold tabular-nums sm:text-8xl"
          >
            {qty % 1 === 0 ? qty : qty.toFixed(1)}
          </span>
        </div>

        <button
          type="button"
          aria-label="زوّد"
          onClick={() => change(STEP)}
          disabled={qty >= MAX}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-3xl font-bold text-card shadow-[0_2px_8px_rgba(192,133,82,0.35)] transition-all hover:bg-accent-deep active:scale-95 disabled:opacity-35 motion-reduce:transition-none sm:h-18 sm:w-18"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={() => router.push(`${resultHref}&qty=${qty}`)}
        className="mt-12 w-full max-w-sm rounded-full bg-accent px-8 py-4.5 text-xl font-bold text-card shadow-[0_2px_10px_rgba(192,133,82,0.4)] transition-all hover:bg-accent-deep active:scale-[0.98] motion-reduce:transition-none"
      >
        احسب الوصفة
      </button>
    </div>
  );
}
