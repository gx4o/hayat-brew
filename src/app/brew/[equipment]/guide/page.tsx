import Link from "next/link";

export default async function GuidePage({
  params,
  searchParams,
}: {
  params: Promise<{ equipment: string }>;
  searchParams: Promise<{ style?: string; unit?: string; qty?: string }>;
}) {
  const { equipment } = await params;
  const sp = await searchParams;
  const backHref = `/brew/${equipment}/result?style=${sp.style}&unit=${sp.unit}&qty=${sp.qty}`;

  return (
    <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-10">
      <Link href={backHref} className="text-base text-muted hover:text-foreground">
        → رجوع للوصفة
      </Link>
      <h1 className="mt-5 font-display text-4xl font-bold">التحضير الموجّه</h1>
      <p className="mt-4 text-lg text-muted">
        المؤقت الدائري ووضع المطبخ للآيباد — الخطوة القادمة في البناء.
      </p>
    </main>
  );
}
