"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadSettings, playTimerSound, vibrate } from "@/lib/settings";

function format(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Reusable circular countdown: start / pause / reset, completion feedback. */
export function CircularTimer({
  seconds,
  size = "regular",
}: {
  seconds: number;
  size?: "regular" | "kitchen";
}) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const endAtRef = useRef<number | null>(null);
  const doneRef = useRef(false);

  const done = remaining <= 0;

  useEffect(() => {
    setRemaining(seconds);
    setRunning(false);
    endAtRef.current = null;
    doneRef.current = false;
  }, [seconds]);

  useEffect(() => {
    if (!running) return;
    endAtRef.current = Date.now() + remaining * 1000;
    const id = setInterval(() => {
      const left = Math.max(
        0,
        Math.round(((endAtRef.current ?? 0) - Date.now()) / 1000)
      );
      setRemaining(left);
      if (left <= 0) {
        clearInterval(id);
        setRunning(false);
        if (!doneRef.current) {
          doneRef.current = true;
          const settings = loadSettings();
          if (settings.timerVibration) vibrate([220, 100, 220]);
          if (settings.timerSound) playTimerSound();
        }
      }
    }, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const reset = useCallback(() => {
    setRunning(false);
    setRemaining(seconds);
    doneRef.current = false;
  }, [seconds]);

  const progress = seconds === 0 ? 0 : (seconds - remaining) / seconds;
  const R = 54;
  const C = 2 * Math.PI * R;
  const big = size === "kitchen";

  return (
    <div className="flex flex-col items-center" role="timer" aria-live="polite">
      <div className={`relative ${big ? "h-64 w-64" : "h-48 w-48"}`}>
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="var(--card)"
            stroke="var(--line)"
            strokeWidth="7"
          />
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke={done ? "var(--accent-deep)" : "var(--accent)"}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            className="transition-[stroke-dashoffset] duration-300 ease-linear motion-reduce:transition-none"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {done ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent-deep)"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`${big ? "h-16 w-16" : "h-12 w-12"} check-pop`}
              aria-label="انتهى الوقت"
            >
              <path d="M4.5 12.5l5 5 10-11" />
            </svg>
          ) : (
            <span
              className={`font-display font-bold tabular-nums ${big ? "text-6xl" : "text-5xl"}`}
              dir="ltr"
            >
              {format(remaining)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        {done ? (
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-line bg-card px-6 py-2.5 text-base font-medium transition-all hover:border-accent/40 active:scale-95 motion-reduce:transition-none"
          >
            إعادة
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              className={`rounded-full px-8 py-3 text-lg font-bold transition-all active:scale-95 motion-reduce:transition-none ${
                running
                  ? "border border-line bg-card text-foreground"
                  : "bg-accent text-card shadow-[0_2px_8px_rgba(192,133,82,0.35)] hover:bg-accent-deep"
              }`}
            >
              {running ? "إيقاف مؤقت" : "ابدأ المؤقت"}
            </button>
            {remaining !== seconds ? (
              <button
                type="button"
                onClick={reset}
                className="rounded-full border border-line bg-card px-5 py-3 text-base font-medium text-muted transition-all hover:text-foreground active:scale-95 motion-reduce:transition-none"
              >
                إعادة
              </button>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
