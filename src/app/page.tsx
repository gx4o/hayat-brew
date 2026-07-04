import { EquipmentCard } from "@/components/EquipmentCard";
import { FavoritesList } from "@/components/FavoritesList";
import { Greeting } from "@/components/Greeting";
import { LastBrew } from "@/components/LastBrew";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600;

interface EquipmentRow {
  slug: string;
  name_ar: string;
  subtitle_ar: string | null;
}

// Keeps the kitchen usable even if the database is briefly unreachable.
const FALLBACK_EQUIPMENT: EquipmentRow[] = [
  { slug: "coffee-machine", name_ar: "ماكينة القهوة", subtitle_ar: "تحضير تلقائي" },
  { slug: "v60", name_ar: "V60", subtitle_ar: "تحضير يدوي" },
];

async function getEquipment(): Promise<EquipmentRow[]> {
  try {
    const { data } = await supabase
      .from("equipment")
      .select("slug,name_ar,subtitle_ar")
      .order("sort_order");
    if (data && data.length > 0) return data;
  } catch {
    // fall through to fallback
  }
  return FALLBACK_EQUIPMENT;
}

export default async function HomePage() {
  const equipment = await getEquipment();

  return (
    <main className="mx-auto w-full max-w-xl px-5 pb-32 pt-12 lg:max-w-5xl lg:px-10 lg:pt-16">
      <Greeting />

      <div className="mt-8 grid gap-4 sm:gap-5 lg:mt-12 lg:grid-cols-2 lg:gap-7">
        {equipment.map((item) => (
          <EquipmentCard
            key={item.slug}
            slug={item.slug}
            nameAr={item.name_ar}
            subtitleAr={item.subtitle_ar}
          />
        ))}
      </div>

      <LastBrew />
      <FavoritesList />
    </main>
  );
}
