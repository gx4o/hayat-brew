import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OptionCard } from "@/components/brew/OptionCard";
import { QuantityPicker } from "@/components/brew/QuantityPicker";
import { getEquipmentInfo, getServingUnits } from "@/lib/data";
import { ART, type ArtKey } from "@/lib/illustrations";
import type { RecipeStyle } from "@/lib/recipe-engine";

export const revalidate = 3600;

const STYLE_META: Record<RecipeStyle, { title: string }> = {
  hot: { title: "حارة" },
  iced: { title: "باردة" },
};

function BackLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-base text-muted transition-colors hover:text-foreground"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4.5 w-4.5"
        aria-hidden
      >
        <path d="M10 6l6 6-6 6" />
      </svg>
      رجوع
    </Link>
  );
}

export default async function BrewFlowPage({
  params,
  searchParams,
}: {
  params: Promise<{ equipment: string }>;
  searchParams: Promise<{ style?: string; unit?: string }>;
}) {
  const { equipment: equipmentSlug } = await params;
  const sp = await searchParams;

  const [equipment, units] = await Promise.all([
    getEquipmentInfo(equipmentSlug),
    getServingUnits(),
  ]);
  if (!equipment) notFound();

  const style =
    sp.style === "hot" || sp.style === "iced" ? (sp.style as RecipeStyle) : null;
  const unit = units.find((u) => u.slug === sp.unit) ?? null;

  const base = `/brew/${equipmentSlug}`;

  // ---- Step 1: hot or iced ----------------------------------------
  if (!style || !equipment.styles.includes(style)) {
    return (
      <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-10 lg:max-w-3xl">
        <BackLink href="/" />
        <p className="mt-6 text-lg text-muted">{equipment.nameAr}</p>
        <h1 className="mt-1 font-display text-4xl font-bold sm:text-5xl">
          كيف تبي قهوتك؟
        </h1>
        <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          {equipment.styles.map((s) => {
            const art = ART[s === "hot" ? "hot-coffee" : "iced-coffee"];
            return (
              <OptionCard
                key={s}
                href={`${base}?style=${s}`}
                title={STYLE_META[s].title}
                visual={
                  <div
                    className="h-full w-full overflow-hidden rounded-[1.25rem]"
                    style={{ backgroundColor: art.canvas }}
                  >
                    <Image src={art.src} alt="" className="h-full w-full object-cover" />
                  </div>
                }
              />
            );
          })}
        </div>
      </main>
    );
  }

  // ---- Step 2: serving unit ----------------------------------------
  if (!unit) {
    return (
      <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-10 lg:max-w-3xl">
        <BackLink href={base} />
        <p className="mt-6 text-lg text-muted">
          {equipment.nameAr} · {STYLE_META[style].title}
        </p>
        <h1 className="mt-1 font-display text-4xl font-bold sm:text-5xl">
          وش نحسب لك؟
        </h1>
        <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          {units.map((u) => (
            <OptionCard
              key={u.slug}
              href={`${base}?style=${style}&unit=${u.slug}`}
              title={u.nameAr}
              subtitle={`${u.volumeMl} مل`}
              visual={(() => {
                const art = ART[(u.slug === "mug" ? "mug" : "cup") as ArtKey];
                const size =
                  u.slug === "mug" ? "h-full w-full" : "h-[78%] w-[78%]";
                return (
                  <div
                    className="flex h-full w-full items-center justify-center overflow-hidden rounded-[1.25rem]"
                    style={{ backgroundColor: art.canvas }}
                  >
                    <Image src={art.src} alt="" className={`${size} object-cover`} />
                  </div>
                );
              })()}
            />
          ))}
        </div>
      </main>
    );
  }

  // ---- Step 3: quantity ----------------------------------------
  return (
    <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-10">
      <BackLink href={`${base}?style=${style}`} />
      <p className="mt-6 text-lg text-muted">
        {equipment.nameAr} · {STYLE_META[style].title} · {unit.nameAr}
      </p>
      <h1 className="mt-1 font-display text-4xl font-bold sm:text-5xl">
        {unit.questionAr ?? `كم ${unit.nameAr} بتسوي؟`}
      </h1>
      <QuantityPicker
        resultHref={`${base}/result?style=${style}&unit=${unit.slug}`}
        initial={1}
      />
    </main>
  );
}
