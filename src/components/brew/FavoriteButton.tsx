"use client";

import { useEffect, useState } from "react";
import {
  addFavorite,
  findFavorite,
  removeFavorite,
  type FavoriteEntry,
} from "@/lib/favorites";

export function FavoriteButton(props: {
  recipeSlug: string;
  recipeNameAr: string;
  equipmentSlug: string;
  style: "hot" | "iced";
  unitSlug: string;
  unitNameAr: string;
  quantity: number;
  defaultName: string;
}) {
  const [existing, setExisting] = useState<FavoriteEntry | null>(null);
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState(props.defaultName);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setExisting(findFavorite(props.recipeSlug, props.unitSlug, props.quantity) ?? null);
    setLoaded(true);
  }, [props.recipeSlug, props.unitSlug, props.quantity]);

  if (!loaded) return <div className="min-h-14" />;

  if (existing) {
    return (
      <div className="flex items-center justify-center gap-3 py-3.5 text-lg">
        <span className="font-medium text-accent-deep">
          محفوظة في المفضلة ✓ «{existing.name}»
        </span>
        <button
          type="button"
          onClick={() => {
            removeFavorite(existing.id);
            setExisting(null);
          }}
          className="text-base text-muted underline-offset-4 hover:underline"
        >
          إزالة
        </button>
      </div>
    );
  }

  if (naming) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const trimmed = name.trim();
          if (!trimmed) return;
          setExisting(addFavorite({ ...props, name: trimmed }));
          setNaming(false);
        }}
        className="flex items-center gap-2.5"
      >
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسم الوصفة — مثلاً: قهوة فارس"
          maxLength={40}
          className="min-w-0 flex-1 rounded-full border border-line bg-card px-5 py-3.5 text-lg outline-none transition-colors focus:border-accent"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-accent px-6 py-3.5 text-lg font-bold text-card transition-colors hover:bg-accent-deep"
        >
          حفظ
        </button>
      </form>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setNaming(true)}
      className="w-full rounded-full py-3.5 text-center text-lg font-medium text-muted transition-colors hover:text-foreground"
    >
      ♡ حفظ في المفضلة
    </button>
  );
}
