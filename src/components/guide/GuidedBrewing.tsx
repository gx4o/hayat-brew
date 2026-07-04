"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CircularTimer } from "./CircularTimer";
import { ART, artForStep, type ArtKey } from "@/lib/illustrations";
import { loadSettings } from "@/lib/settings";
import type { CalculatedStep } from "@/lib/recipe-engine";

/** Keeps the screen awake during brewing where the Wake Lock API exists. */
function useWakeLock(enabled: boolean) {
  useEffect(() => {
    if (!enabled || !("wakeLock" in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    let cancelled = false;

    const acquire = async () => {
      try {
        lock = await navigator.wakeLock.request("screen");
      } catch {
        // unsupported or denied — degrade gracefully
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible" && !cancelled) acquire();
    };

    acquire();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibility);
      lock?.release().catch(() => {});
    };
  }, [enabled]);
}

function StepArt({ artKey, kitchen }: { artKey: ArtKey; kitchen?: boolean }) {
  const art = ART[artKey];
  return (
    <div
      className={`overflow-hidden rounded-card ${
        kitchen ? "h-72 w-72 xl:h-80 xl:w-80" : "mx-auto h-52 w-52 sm:h-60 sm:w-60"
      }`}
      style={{ backgroundColor: art.canvas }}
    >
      <Image
        src={art.src}
        alt=""
        className="h-full w-full object-cover"
        priority
      />
    </div>
  );
}

export function GuidedBrewing({
  title,
  equipmentSlug,
  style,
  steps,
  servingIceNoteAr,
  exitHref,
}: {
  title: string;
  equipmentSlug: string;
  style: "hot" | "iced";
  steps: CalculatedStep[];
  servingIceNoteAr: string | null;
  exitHref: string;
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [wakeEnabled, setWakeEnabled] = useState(false);

  useEffect(() => {
    setWakeEnabled(loadSettings().keepScreenAwake);
  }, []);
  useWakeLock(wakeEnabled && !finished);

  const total = steps.length;
  const step = steps[index];
  const isLast = index === total - 1;

  // ---------- Ready state ----------
  if (finished) {
    const readyArt = ART[style === "iced" ? "ready-iced" : "ready-hot"];
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-10 text-center">
        <div
          className="ready-pop h-64 w-64 overflow-hidden rounded-card sm:h-72 sm:w-72"
          style={{ backgroundColor: readyArt.canvas }}
        >
          <Image src={readyArt.src} alt="" className="h-full w-full object-cover" priority />
        </div>
        <h1 className="mt-8 font-display text-5xl font-bold sm:text-6xl">
          قهوتك جاهزة
        </h1>
        {servingIceNoteAr ? (
          <p className="mt-4 max-w-md text-xl text-muted">{servingIceNoteAr}</p>
        ) : null}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-10 rounded-full bg-accent px-12 py-4.5 text-xl font-bold text-card shadow-[0_2px_10px_rgba(192,133,82,0.4)] transition-all hover:bg-accent-deep active:scale-[0.98] motion-reduce:transition-none"
        >
          صحة وعافية 🤍
        </button>
      </main>
    );
  }

  const artKey = artForStep(step.titleAr, equipmentSlug);

  const controls = (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => (isLast ? setFinished(true) : setIndex((i) => i + 1))}
        className="flex-1 rounded-full bg-accent px-8 py-4 text-xl font-bold text-card shadow-[0_2px_10px_rgba(192,133,82,0.4)] transition-all hover:bg-accent-deep active:scale-[0.98] motion-reduce:transition-none lg:flex-none lg:px-12"
      >
        {isLast ? "خلصت ✓" : "التالي"}
      </button>
      {index > 0 ? (
        <button
          type="button"
          onClick={() => setIndex((i) => i - 1)}
          className="rounded-full border border-line bg-card px-6 py-4 text-lg font-medium text-muted transition-all hover:text-foreground active:scale-[0.98] motion-reduce:transition-none"
        >
          السابق
        </button>
      ) : null}
    </div>
  );

  const progress = (
    <div className="flex items-center gap-3">
      <span className="text-base font-medium text-muted">
        الخطوة {index + 1} من {total}
      </span>
      <div className="flex gap-1.5" aria-hidden>
        {steps.map((s, i) => (
          <span
            key={s.stepNumber}
            className={`h-2 rounded-full transition-all duration-300 motion-reduce:transition-none ${
              i === index ? "w-6 bg-accent" : i < index ? "w-2 bg-accent/50" : "w-2 bg-line"
            }`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5 pb-8 pt-6 lg:max-w-6xl lg:px-10">
      {/* top bar */}
      <div className="flex items-center justify-between">
        <p className="truncate text-base font-medium text-muted">{title}</p>
        <Link
          href={exitHref}
          aria-label="إنهاء التحضير"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-card text-muted transition-colors hover:text-foreground"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </Link>
      </div>

      {/* iPad landscape: split composition. Mobile: vertical stack. */}
      <div className="mt-4 flex flex-1 flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-14">
        {/* instruction side (right in RTL) */}
        <section className="order-2 flex flex-col justify-center lg:order-1">
          <div className="mt-5 lg:mt-0">{progress}</div>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl lg:text-6xl">
            {step.titleAr}
          </h1>
          <p className="mt-4 text-2xl leading-relaxed sm:text-3xl lg:mt-6 lg:text-4xl lg:leading-snug">
            {step.instructionAr}
          </p>
          {step.cumulativeTargetMl != null ? (
            <p className="mt-3 text-lg text-muted">
              الهدف التراكمي: <span className="font-bold tabular-nums text-accent-deep">{step.cumulativeTargetMl} مل</span>
            </p>
          ) : null}
          <div className="mt-8 hidden lg:block">{controls}</div>
        </section>

        {/* visual side (left in RTL) */}
        <section className="order-1 flex flex-col items-center justify-center gap-6 lg:order-2">
          <div className="hidden lg:block">
            <StepArt artKey={artKey} kitchen />
          </div>
          <div className="lg:hidden">
            <StepArt artKey={artKey} />
          </div>
          {step.timerSeconds ? (
            <>
              <div className="hidden lg:block">
                <CircularTimer seconds={step.timerSeconds} size="kitchen" />
              </div>
              <div className="lg:hidden">
                <CircularTimer seconds={step.timerSeconds} />
              </div>
            </>
          ) : null}
        </section>
      </div>

      {/* mobile controls pinned at the bottom of the flow */}
      <div className="mt-8 lg:hidden">{controls}</div>
    </main>
  );
}
