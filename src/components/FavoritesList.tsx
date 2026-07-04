"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { loadFavorites, type FavoriteEntry } from "@/lib/favorites";
import { formatQuantityAr } from "@/lib/arabic";
import { ART } from "@/lib/illustrations";

export function FavoritesList() {
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);

  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  if (favorites.length === 0) return null;

  return (
    <section aria-label="المفضلة" className="mt-8 lg:mt-10">
      <h2 className="text-xl font-bold text-muted">المفضلة</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {favorites.map((fav) => (
          <Link
            key={fav.id}
            href={`/brew/${fav.equipmentSlug}/result?style=${fav.style}&unit=${fav.unitSlug}&qty=${fav.quantity}`}
            className="flex items-center gap-3.5 rounded-card border border-line bg-card/70 p-3.5 transition-colors hover:bg-card active:scale-[0.99] motion-reduce:active:scale-100"
          >
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={ART[fav.style === "iced" ? "iced-coffee" : "hot-coffee"].src}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-bold">{fav.name}</p>
              <p className="truncate text-sm text-muted">
                {fav.recipeNameAr} · {formatQuantityAr(fav.quantity, fav.unitSlug)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
