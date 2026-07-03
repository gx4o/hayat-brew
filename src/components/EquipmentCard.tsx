import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import coffeeMachineArt from "@/assets/illustrations/coffee-machine.webp";
import v60PourArt from "@/assets/illustrations/v60-pour.webp";

/**
 * Official illustration per equipment slug. `canvas` is each artwork's own
 * background color — the media area uses it so the image blends seamlessly.
 */
const ART_BY_SLUG: Record<string, { src: StaticImageData; canvas: string }> = {
  "coffee-machine": { src: coffeeMachineArt, canvas: "#fdf9f2" },
  v60: { src: v60PourArt, canvas: "#fbf3e8" },
};

export function EquipmentCard({
  slug,
  nameAr,
  subtitleAr,
}: {
  slug: string;
  nameAr: string;
  subtitleAr: string | null;
}) {
  const art = ART_BY_SLUG[slug];

  return (
    <Link
      href={`/brew/${slug}`}
      className="group flex items-stretch gap-1 rounded-card border border-line bg-card p-4 shadow-card transition-all duration-200 hover:shadow-[0_8px_24px_rgba(75,46,43,0.12)] active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 sm:p-5 lg:p-6"
    >
      {/* text side (right in RTL) */}
      <div className="flex min-w-0 flex-1 flex-col justify-between py-3 pr-2 sm:py-4">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">{nameAr}</h2>
          {subtitleAr ? (
            <p className="mt-1.5 text-base text-muted sm:text-lg">{subtitleAr}</p>
          ) : null}
        </div>
        <span
          aria-hidden
          className="mt-6 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-card transition-colors group-hover:bg-accent-deep"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M14 6l-6 6 6 6" />
          </svg>
        </span>
      </div>

      {/* illustration side (left in RTL) */}
      {art ? (
        <div
          className="flex w-[42%] shrink-0 items-center justify-center overflow-hidden rounded-[1.25rem] sm:w-[46%]"
          style={{ backgroundColor: art.canvas }}
        >
          <Image
            src={art.src}
            alt={nameAr}
            className="h-full w-full object-cover"
            sizes="(min-width: 1024px) 320px, 45vw"
            priority
          />
        </div>
      ) : null}
    </Link>
  );
}
