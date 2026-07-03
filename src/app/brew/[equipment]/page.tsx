import Link from "next/link";

export default async function BrewPage({
  params,
}: {
  params: Promise<{ equipment: string }>;
}) {
  const { equipment } = await params;
  const nameAr = equipment === "v60" ? "V60" : "ماكينة القهوة";

  return (
    <main className="mx-auto max-w-lg px-5 pb-16 pt-12">
      <Link href="/" className="text-sm text-muted hover:text-foreground">
        → الرئيسية
      </Link>
      <h1 className="mt-4 font-display text-4xl font-bold">{nameAr}</h1>
      <p className="mt-4 text-muted">
        شاشة «كيف تبي قهوتك؟» — الخطوة القادمة في البناء.
      </p>
    </main>
  );
}
