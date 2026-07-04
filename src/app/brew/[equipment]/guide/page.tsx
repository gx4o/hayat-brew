import { notFound } from "next/navigation";
import { GuidedBrewing } from "@/components/guide/GuidedBrewing";
import { formatQuantityAr } from "@/lib/arabic";
import { getRecipeFull, getServingUnits } from "@/lib/data";
import { calculateRecipe, MIN_QUANTITY } from "@/lib/recipe-engine";
import type { RecipeStyle } from "@/lib/recipe-engine";

export const revalidate = 3600;

export default async function GuidePage({
  params,
  searchParams,
}: {
  params: Promise<{ equipment: string }>;
  searchParams: Promise<{ style?: string; unit?: string; qty?: string }>;
}) {
  const { equipment: equipmentSlug } = await params;
  const sp = await searchParams;

  const style =
    sp.style === "hot" || sp.style === "iced" ? (sp.style as RecipeStyle) : null;
  if (!style) notFound();

  const [recipe, units] = await Promise.all([
    getRecipeFull(equipmentSlug, style),
    getServingUnits(),
  ]);
  const unit = units.find((u) => u.slug === sp.unit);
  if (!recipe || !unit) notFound();

  const rawQty = Number.parseFloat(sp.qty ?? "1");
  const quantity = Number.isFinite(rawQty)
    ? Math.max(MIN_QUANTITY, Math.round(rawQty * 2) / 2)
    : 1;

  const calc = calculateRecipe({ recipe, servingUnit: unit, quantity });
  const title = `${recipe.nameAr.replace(" — ", " ")} — ${formatQuantityAr(quantity, unit.slug)}`;

  return (
    <GuidedBrewing
      title={title}
      equipmentSlug={equipmentSlug}
      style={style}
      steps={calc.steps}
      servingIceNoteAr={calc.servingIceNoteAr}
      exitHref={`/brew/${equipmentSlug}/result?style=${style}&unit=${unit.slug}&qty=${quantity}`}
    />
  );
}
