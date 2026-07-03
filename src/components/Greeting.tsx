"use client";

import { useEffect, useState } from "react";

/**
 * Time-aware greeting as the main heading, with the softer question below.
 * Computed after mount so the statically-rendered page never shows the
 * wrong half of the day.
 */
export function Greeting() {
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour >= 4 && hour < 12 ? "صباح الخير ☀️" : "مساء الخير 🌙");
  }, []);

  return (
    <header
      className={`transition-opacity duration-500 ${
        greeting ? "opacity-100" : "opacity-0"
      }`}
    >
      <h1 className="min-h-12 font-display text-4xl font-bold sm:text-5xl">
        {greeting}
      </h1>
      <p className="mt-2.5 text-xl text-muted sm:text-2xl">وش بنسوي اليوم؟</p>
    </header>
  );
}
