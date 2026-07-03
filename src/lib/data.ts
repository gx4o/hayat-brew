import { supabase } from "./supabase";
import type {
  Recipe,
  RecipeStyle,
  ServingUnit,
} from "./recipe-engine";

export interface ServingUnitWithQuestion extends ServingUnit {
  questionAr: string | null;
}

export interface EquipmentInfo {
  slug: string;
  nameAr: string;
  styles: RecipeStyle[];
}

export async function getServingUnits(): Promise<ServingUnitWithQuestion[]> {
  const { data, error } = await supabase
    .from("serving_units")
    .select("slug,name_ar,quantity_question_ar,volume_ml")
    .order("sort_order");
  if (error || !data) throw new Error("failed to load serving units");
  return data.map((row) => ({
    slug: row.slug,
    nameAr: row.name_ar,
    volumeMl: Number(row.volume_ml),
    questionAr: row.quantity_question_ar,
  }));
}

export async function getEquipmentInfo(
  slug: string
): Promise<EquipmentInfo | null> {
  const { data } = await supabase
    .from("equipment")
    .select("slug,name_ar,recipes(style,sort_order)")
    .eq("slug", slug)
    .single();
  if (!data) return null;
  const styles = [...(data.recipes ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((r) => r.style as RecipeStyle);
  return { slug: data.slug, nameAr: data.name_ar, styles };
}

/** Full recipe (ingredients + steps) mapped to engine types. */
export async function getRecipeFull(
  equipmentSlug: string,
  style: RecipeStyle
): Promise<Recipe | null> {
  const { data: equipment } = await supabase
    .from("equipment")
    .select("id")
    .eq("slug", equipmentSlug)
    .single();
  if (!equipment) return null;

  const { data: r } = await supabase
    .from("recipes")
    .select("*, recipe_ingredients(*), recipe_steps(*)")
    .eq("equipment_id", equipment.id)
    .eq("style", style)
    .single();
  if (!r) return null;

  return {
    slug: r.slug,
    style: r.style,
    nameAr: r.name_ar,
    referenceVolumeMl: Number(r.reference_volume_ml),
    tempMinC: r.temp_min_c == null ? null : Number(r.temp_min_c),
    tempMaxC: r.temp_max_c == null ? null : Number(r.temp_max_c),
    lightRoastNoteAr: r.light_roast_note_ar,
    grindNoteAr: r.grind_note_ar,
    servingIceNoteAr: r.serving_ice_note_ar,
    bloomWaterMultiplier:
      r.bloom_water_multiplier == null ? null : Number(r.bloom_water_multiplier),
    bloomSecondsMin: r.bloom_seconds_min,
    bloomSecondsMax: r.bloom_seconds_max,
    estimatedBrewSeconds: r.estimated_brew_seconds,
    ingredients: (r.recipe_ingredients ?? []).map(
      (ing: Record<string, unknown>) => ({
        ingredientSlug: ing.ingredient_slug as string,
        nameAr: ing.name_ar as string,
        unit: ing.unit as "g" | "ml",
        amountPerServing: Number(ing.amount_per_serving),
        sortOrder: ing.sort_order as number,
      })
    ),
    steps: (r.recipe_steps ?? []).map((step: Record<string, unknown>) => ({
      stepNumber: step.step_number as number,
      titleAr: step.title_ar as string,
      instructionAr: step.instruction_ar as string,
      timerSeconds: step.timer_seconds as number | null,
      cumulativeWaterFraction:
        step.cumulative_water_fraction == null
          ? null
          : Number(step.cumulative_water_fraction),
    })),
  };
}
