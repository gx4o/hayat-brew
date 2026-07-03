import Link from "next/link";
import { notFound } from "next/navigation";
import { SaveLastBrew } from "@/components/brew/SaveLastBrew";
import {
  IconBean,
  IconDrop,
  IconIce,
  IconThermometer,
} from "@/components/icons";
import { formatQuantityAr } from "@/lib/arabic";
import { getRecipeFull, getServingUnits } from "@/lib/data";
import { calculateRecipe, MIN_QUANTITY } from "@/lib/recipe-engine";
import type { RecipeStyle } from "@/lib/recipe-engine";

export const revalidate = 3600;

const INGREDIENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  coffee: IconBean,
  water: IconDrop,
  server_ice: IconIce,
};

function MetricCard({
  icon: Icon,
  value,
  unit,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  unit: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-card border border-line bg-card px-4 py-6 text-center shadow-card">
      <Icon className="h-8 w-8 text-accent" />
      <p className="mt-3 text-4xl font-bold tabular-nums sm:text-5xl">
        {value}
        <span className="ms-1 text-xl font-medium text-muted">{unit}</span>
      </p>
      <p className="mt-1.5 text-base text-muted">{label}</p>
    </div>
  );
}

export default async function ResultPage({
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
  const backHref = `/brew/${equipmentSlug}?style=${style}&unit=${unit.slug}`;
  const guideHref = `/brew/${equipmentSlug}/guide?style=${style}&unit=${unit.slug}&qty=${quantity}`;

  return (
    <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-10 lg:max-w-5xl lg:px-10">
      <SaveLastBrew
        recipeSlug={recipe.slug}
        recipeNameAr={recipe.nameAr}
        equipmentSlug={equipmentSlug}
        style={style}
        unitSlug={unit.slug}
        unitNameAr={unit.nameAr}
        quantity={quantity}
      />

      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-base text-muted transition-colors hover:text-foreground"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5" aria-hidden>
          <path d="M10 6l6 6-6 6" />
        </svg>
        رجوع
      </Link>

      <div className="lg:mt-4 lg:grid lg:grid-cols-[1.2fr_1fr] lg:items-start lg:gap-12">
        {/* Overview + metrics */}
        <section>
          <h1 className="mt-5 font-display text-4xl font-bold sm:text-5xl lg:mt-0">
            {title}
          </h1>

          <div className="mt-8 grid grid-cols-2 gap-3.5 sm:gap-5">
            {calc.ingredients.map((ing) => {
              const Icon = INGREDIENT_ICONS[ing.ingredientSlug] ?? IconBean;
              return (
                <MetricCard
                  key={ing.ingredientSlug}
                  icon={Icon}
                  value={String(ing.amount)}
                  unit={ing.unit === "g" ? "g" : "ml"}
                  label={ing.nameAr}
                />
              );
            })}
            {calc.temperature ? (
              <MetricCard
                icon={IconThermometer}
                value={`${calc.temperature.minC}–${calc.temperature.maxC}°`}
                unit=""
                label="حرارة الموية"
              />
            ) : null}
          </div>

          <div className="mt-6 space-y-2.5">
            {calc.servingIceNoteAr ? (
              <p className="flex items-center gap-2.5 text-base text-muted">
                <IconIce className="h-5 w-5 shrink-0 text-iced" />
                {calc.servingIceNoteAr}
              </p>
            ) : null}
            {calc.grindNoteAr ? (
              <p className="flex items-center gap-2.5 text-base text-muted">
                <IconBean className="h-5 w-5 shrink-0 text-accent" />
                {calc.grindNoteAr}
              </p>
            ) : null}
            {calc.lightRoastNoteAr ? (
              <p className="flex items-center gap-2.5 text-base text-muted">
                <IconThermometer className="h-5 w-5 shrink-0 text-accent" />
                {calc.lightRoastNoteAr}
              </p>
            ) : null}
          </div>
        </section>

        {/* Preparation summary + CTA */}
        <section className="mt-10 lg:mt-16">
          <div className="rounded-card border border-line bg-card/70 p-6">
            <h2 className="text-lg font-bold text-muted">خطوات التحضير</h2>
            <ol className="mt-4 space-y-3">
              {calc.steps.map((step) => (
                <li key={step.stepNumber} className="flex items-center gap-3 text-lg">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-background text-sm font-bold text-accent-deep">
                    {step.stepNumber}
                  </span>
                  {step.titleAr}
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-7 flex flex-col gap-3">
            <Link
              href={guideHref}
              className="w-full rounded-full bg-accent px-8 py-4.5 text-center text-xl font-bold text-card shadow-[0_2px_10px_rgba(192,133,82,0.4)] transition-all hover:bg-accent-deep active:scale-[0.98] motion-reduce:transition-none"
            >
              ابدأ التحضير
            </Link>
            <Link
              href={backHref}
              className="w-full rounded-full border border-line bg-card px-8 py-4 text-center text-lg font-medium text-foreground transition-all hover:border-accent/40 active:scale-[0.98] motion-reduce:transition-none"
            >
              إعادة الحساب
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
