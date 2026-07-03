import type {
  CalculateRecipeInput,
  CalculatedRecipe,
  CalculatedStep,
  DisplayIngredient,
  PourStage,
} from "./types";

export const MIN_QUANTITY = 0.5;

/**
 * Display rounding rules (all math is exact until the final step):
 * - coffee: nearest 0.05 g — keeps family reference values intact
 *   (18.75 g, 43.75 g) while a mug at 1:16 reads 20.2 g, not 20.1875.
 * - water: nearest whole ml.
 * - server ice: nearest 5 g — kitchen-scale friendly (57.5→60, 172.5→175).
 * - bloom water & pour targets: nearest 5 ml, final pour clamped to total water.
 */
function roundToStep(value: number, step: number): number {
  return Number((Math.round(value / step) * step).toFixed(2));
}

function resolvePlaceholders(
  template: string,
  values: Record<string, number | null>
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = values[key];
    return value == null ? match : formatAmount(value);
  });
}

/** "37.5" stays "37.5", "50" stays "50" — no trailing zeros. */
export function formatAmount(value: number): string {
  return String(value);
}

export function calculateRecipe({
  recipe,
  servingUnit,
  quantity,
}: CalculateRecipeInput): CalculatedRecipe {
  if (!Number.isFinite(quantity) || quantity < MIN_QUANTITY) {
    throw new Error(`quantity must be at least ${MIN_QUANTITY}`);
  }

  // One scale factor drives everything: how many reference servings
  // (e.g. 200 ml cups) fit in the requested total volume.
  const scale = (servingUnit.volumeMl / recipe.referenceVolumeMl) * quantity;

  const exactAmounts = new Map<string, number>();
  for (const ingredient of recipe.ingredients) {
    exactAmounts.set(
      ingredient.ingredientSlug,
      ingredient.amountPerServing * scale
    );
  }

  const coffeeExact = exactAmounts.get("coffee") ?? 0;
  const waterExact = exactAmounts.get("water") ?? 0;
  const serverIceExact = exactAmounts.get("server_ice");

  const coffeeGrams = roundToStep(coffeeExact, 0.05);
  const waterMl = Math.round(waterExact);
  const serverIceGrams =
    serverIceExact === undefined ? null : roundToStep(serverIceExact, 5);

  const bloomWaterMl =
    recipe.bloomWaterMultiplier == null
      ? null
      : roundToStep(coffeeExact * recipe.bloomWaterMultiplier, 5);

  const displayAmountFor = (slug: string, unit: string, exact: number) => {
    if (slug === "coffee") return roundToStep(exact, 0.05);
    if (slug === "server_ice") return roundToStep(exact, 5);
    return Math.round(exact); // water and any future ml/g ingredient
  };

  const ingredients: DisplayIngredient[] = [...recipe.ingredients]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((ingredient) => ({
      ingredientSlug: ingredient.ingredientSlug,
      nameAr: ingredient.nameAr,
      unit: ingredient.unit,
      amount: displayAmountFor(
        ingredient.ingredientSlug,
        ingredient.unit,
        exactAmounts.get(ingredient.ingredientSlug) ?? 0
      ),
    }));

  const stageTargetFor = (fraction: number): number =>
    fraction >= 1 ? waterMl : roundToStep(waterExact * fraction, 5);

  const orderedSteps = [...recipe.steps].sort(
    (a, b) => a.stepNumber - b.stepNumber
  );

  const pourStages: PourStage[] = orderedSteps
    .filter((step) => step.cumulativeWaterFraction != null)
    .map((step) => ({
      stepNumber: step.stepNumber,
      cumulativeTargetMl: stageTargetFor(step.cumulativeWaterFraction as number),
    }));

  const steps: CalculatedStep[] = orderedSteps.map((step) => {
    const cumulativeTargetMl =
      step.cumulativeWaterFraction == null
        ? null
        : stageTargetFor(step.cumulativeWaterFraction);

    return {
      stepNumber: step.stepNumber,
      titleAr: step.titleAr,
      instructionAr: resolvePlaceholders(step.instructionAr, {
        coffee_g: coffeeGrams,
        water_ml: waterMl,
        server_ice_g: serverIceGrams,
        bloom_water_ml: bloomWaterMl,
        stage_water_ml: cumulativeTargetMl,
        total_water_ml: waterMl,
      }),
      timerSeconds: step.timerSeconds,
      cumulativeTargetMl,
    };
  });

  return {
    recipeSlug: recipe.slug,
    servingUnitSlug: servingUnit.slug,
    quantity,
    totalVolumeMl: Math.round(servingUnit.volumeMl * quantity),
    coffeeGrams,
    waterMl,
    serverIceGrams,
    servingIceNoteAr: recipe.servingIceNoteAr,
    temperature:
      recipe.tempMinC == null || recipe.tempMaxC == null
        ? null
        : {
            minC: recipe.tempMinC,
            maxC: recipe.tempMaxC,
            label: `${recipe.tempMinC}–${recipe.tempMaxC}°C`,
          },
    lightRoastNoteAr: recipe.lightRoastNoteAr,
    grindNoteAr: recipe.grindNoteAr,
    bloomWaterMl,
    bloomSeconds:
      recipe.bloomSecondsMin == null || recipe.bloomSecondsMax == null
        ? null
        : { min: recipe.bloomSecondsMin, max: recipe.bloomSecondsMax },
    estimatedBrewSeconds: recipe.estimatedBrewSeconds,
    ingredients,
    pourStages,
    steps,
  };
}
