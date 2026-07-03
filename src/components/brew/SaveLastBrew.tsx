"use client";

import { useEffect } from "react";
import { LAST_BREW_KEY, type LastBrewSelection } from "@/components/LastBrew";

/** Persists the *selection* (never calculated values) for the home screen. */
export function SaveLastBrew(props: Omit<LastBrewSelection, "savedAt">) {
  useEffect(() => {
    try {
      const entry: LastBrewSelection = { ...props, savedAt: Date.now() };
      localStorage.setItem(LAST_BREW_KEY, JSON.stringify(entry));
    } catch {
      // storage unavailable — not critical
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.recipeSlug, props.unitSlug, props.quantity]);

  return null;
}
