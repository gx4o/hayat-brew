"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import hotCupArt from "@/assets/illustrations/hot-cup.webp";

/**
 * Stored by the result screen after each calculation. Only the *selection*
 * is stored — measurements are always recalculated from current recipe
 * definitions, never from stale values.
 */
export interface LastBrewSelection {
  recipeSlug: string;
  recipeNameAr: string;
  equipmentSlug: string;
  style: "hot" | "iced";
  unitSlug: string;
  unitNameAr: string;
  quantity: number;
  savedAt: number;
}

export const LAST_BREW_KEY = "hayat:last-brew";

function timeAgoAr(ts: number): string {
  const mins = Math.max(1, Math.round((Date.now() - ts) / 60000));
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return hours <= 2 ? "منذ ساعتين تقريباً" : `منذ ${hours} ساعات`;
  const days = Math.round(hours / 24);
  return days === 1 ? "أمس" : `منذ ${days} أيام`;
}

export function LastBrew() {
  const [brew, setBrew] = useState<LastBrewSelection | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LAST_BREW_KEY);
      if (raw) setBrew(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    }
  }, []);

  if (!brew) return null;

  const href = `/brew/${brew.equipmentSlug}/result?style=${brew.style}&unit=${brew.unitSlug}&qty=${brew.quantity}`;

  return (
    <section aria-label="آخر قهوة" className="mt-6 lg:mt-8">
      <Link
        href={href}
        className="flex items-center gap-4 rounded-card border border-line bg-card/70 p-4 transition-colors hover:bg-card active:scale-[0.99] motion-reduce:active:scale-100 sm:gap-5 sm:p-5"
      >
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl sm:h-20 sm:w-20">
          <Image src={hotCupArt} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted">آخر قهوة · {timeAgoAr(brew.savedAt)}</p>
          <p className="mt-0.5 truncate text-lg font-bold">
            {brew.recipeNameAr} — {brew.quantity} {brew.unitNameAr}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-line px-4 py-2 text-sm font-medium text-muted">
          سوّها مرة ثانية
        </span>
      </Link>
    </section>
  );
}
