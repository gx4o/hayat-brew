"use client";

/**
 * Favorites store only the *selection* (recipe + unit + quantity).
 * Measurements are always recalculated from current recipe definitions.
 */
export interface FavoriteEntry {
  id: string;
  name: string;
  recipeSlug: string;
  recipeNameAr: string;
  equipmentSlug: string;
  style: "hot" | "iced";
  unitSlug: string;
  unitNameAr: string;
  quantity: number;
  savedAt: number;
}

export const FAVORITES_KEY = "hayat:favorites";

export function loadFavorites(): FavoriteEntry[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fall through
  }
  return [];
}

export function saveFavorites(list: FavoriteEntry[]) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
  } catch {
    // storage unavailable
  }
}

export function addFavorite(entry: Omit<FavoriteEntry, "id" | "savedAt">): FavoriteEntry {
  const fav: FavoriteEntry = {
    ...entry,
    id: `fav_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    savedAt: Date.now(),
  };
  saveFavorites([fav, ...loadFavorites()]);
  return fav;
}

export function removeFavorite(id: string) {
  saveFavorites(loadFavorites().filter((f) => f.id !== id));
}

/** A favorite matching the exact same selection, if any. */
export function findFavorite(
  recipeSlug: string,
  unitSlug: string,
  quantity: number
): FavoriteEntry | undefined {
  return loadFavorites().find(
    (f) =>
      f.recipeSlug === recipeSlug &&
      f.unitSlug === unitSlug &&
      f.quantity === quantity
  );
}
