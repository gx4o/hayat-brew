// Domain types for the recipe engine.
// These mirror the Supabase schema but stay independent of it, so the
// engine is pure TypeScript and fully testable without a database.

export type RecipeStyle = "hot" | "iced";
export type IngredientUnit = "g" | "ml";

export interface ServingUnit {
  slug: string;
  nameAr: string;
  volumeMl: number;
}

export interface RecipeIngredient {
  ingredientSlug: string;
  nameAr: string;
  unit: IngredientUnit;
  /** Exact amount for ONE serving of `Recipe.referenceVolumeMl`. */
  amountPerServing: number;
  sortOrder: number;
}

export interface RecipeStep {
  stepNumber: number;
  titleAr: string;
  /** May contain placeholders like {coffee_g}, {stage_water_ml}. */
  instructionAr: string;
  timerSeconds: number | null;
  /** For pour steps: cumulative share of total brew water (0..1]. */
  cumulativeWaterFraction: number | null;
}

export interface Recipe {
  slug: string;
  style: RecipeStyle;
  nameAr: string;
  /** Ingredient amounts are defined per one serving of this volume (ml). */
  referenceVolumeMl: number;
  tempMinC: number | null;
  tempMaxC: number | null;
  lightRoastNoteAr: string | null;
  grindNoteAr: string | null;
  servingIceNoteAr: string | null;
  /** Bloom water = coffee grams × this multiplier (V60 recipes). */
  bloomWaterMultiplier: number | null;
  bloomSecondsMin: number | null;
  bloomSecondsMax: number | null;
  estimatedBrewSeconds: number | null;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}

export interface CalculateRecipeInput {
  recipe: Recipe;
  servingUnit: ServingUnit;
  quantity: number;
}

export interface DisplayIngredient {
  ingredientSlug: string;
  nameAr: string;
  unit: IngredientUnit;
  /** Display-rounded amount (see rounding rules in calculate.ts). */
  amount: number;
}

export interface PourStage {
  stepNumber: number;
  /** Cumulative water target in ml, including bloom water. */
  cumulativeTargetMl: number;
}

export interface CalculatedStep {
  stepNumber: number;
  titleAr: string;
  /** Instruction with all placeholders resolved to real numbers. */
  instructionAr: string;
  timerSeconds: number | null;
  cumulativeTargetMl: number | null;
}

export interface TemperatureRange {
  minC: number;
  maxC: number;
  /** e.g. "92–94°C" */
  label: string;
}

export interface CalculatedRecipe {
  recipeSlug: string;
  servingUnitSlug: string;
  quantity: number;
  /** Total target beverage volume in ml (unit volume × quantity). */
  totalVolumeMl: number;
  coffeeGrams: number;
  waterMl: number;
  serverIceGrams: number | null;
  servingIceNoteAr: string | null;
  temperature: TemperatureRange | null;
  lightRoastNoteAr: string | null;
  grindNoteAr: string | null;
  bloomWaterMl: number | null;
  bloomSeconds: { min: number; max: number } | null;
  estimatedBrewSeconds: number | null;
  ingredients: DisplayIngredient[];
  pourStages: PourStage[];
  steps: CalculatedStep[];
}
