import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ART, type ArtKey } from "@/lib/illustrations";

export const revalidate = 3600;
export const metadata = { title: "الوصفات — Hayat Brew" };

interface RecipeRow {
  slug: string;
  name_ar: string;
  description_ar: string | null;
  ratio_label: string | null;
  style: "hot" | "iced";
  equipment: { slug: string } | null;
}

const RECIPE_ART: Record<string, ArtKey> = {
  "coffee-machine-hot": "coffee-machine",
  "coffee-machine-iced": "iced-coffee",
  "v60-hot": "v60",
  "v60-iced": "ready-iced",
};

async function getRecipes(): Promise<RecipeRow[]> {
  const { data } = await supabase
    .from("recipes")
    .select("slug,name_ar,description_ar,ratio_label,style,equipment(slug)")
    .order("sort_order");
  return (data as unknown as RecipeRow[]) ?? [];
}

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <main className="mx-auto w-full max-w-xl px-5 pb-32 pt-12 lg:max-w-5xl lg:px-10">
      <h1 className="font-display text-4xl font-bold sm:text-5xl">الوصفات</h1>

      <div className="mt-8 grid gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-7">
        {recipes.map((recipe) => {
          const art = ART[RECIPE_ART[recipe.slug] ?? "hot-coffee"];
          const equipmentSlug = recipe.equipment?.slug ?? "v60";
          return (
            <div
              key={recipe.slug}
              className="flex items-stretch gap-4 rounded-card border border-line bg-card p-4 shadow-card sm:p-5"
            >
              <div
                className="h-28 w-28 shrink-0 self-center overflow-hidden rounded-2xl sm:h-32 sm:w-32"
                style={{ backgroundColor: art.canvas }}
              >
                <Image src={art.src} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col py-1">
                <h2 className="text-xl font-bold sm:text-2xl">{recipe.name_ar}</h2>
                {recipe.description_ar ? (
                  <p className="mt-1 text-base text-muted">{recipe.description_ar}</p>
                ) : null}
                {recipe.ratio_label ? (
                  <p className="mt-1 text-sm text-muted/80">النسبة: {recipe.ratio_label}</p>
                ) : null}
                <Link
                  href={`/brew/${equipmentSlug}?style=${recipe.style}`}
                  className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-accent px-5 py-2.5 pt-3 text-base font-bold text-card transition-colors hover:bg-accent-deep"
                >
                  احسب الكمية
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
