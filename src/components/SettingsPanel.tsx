"use client";

import { useEffect, useState } from "react";
import { LAST_BREW_KEY } from "@/components/LastBrew";
import { FAVORITES_KEY } from "@/lib/favorites";
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  type AppSettings,
} from "@/lib/settings";

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-card border border-line bg-card px-5 py-4">
      <span className="text-lg">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-8 w-14 shrink-0 rounded-full transition-colors duration-200 motion-reduce:transition-none ${
          checked ? "bg-accent" : "bg-line"
        }`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-card shadow transition-all duration-200 motion-reduce:transition-none ${
            checked ? "right-7" : "right-1"
          }`}
        />
      </button>
    </label>
  );
}

export function SettingsPanel() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const [cleared, setCleared] = useState<string | null>(null);

  useEffect(() => {
    setSettings(loadSettings());
    setLoaded(true);
  }, []);

  const update = (patch: Partial<AppSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings(next);
  };

  const clearKey = (key: string, message: string) => {
    try {
      localStorage.removeItem(key);
      setCleared(message);
      setTimeout(() => setCleared(null), 2500);
    } catch {
      // ignore
    }
  };

  if (!loaded) return <div className="mt-8 min-h-64" />;

  return (
    <div className="mt-8 space-y-3">
      <Toggle
        label="تشغيل الاهتزاز عند انتهاء المؤقت"
        checked={settings.timerVibration}
        onChange={(v) => update({ timerVibration: v })}
      />
      <Toggle
        label="تشغيل صوت المؤقت"
        checked={settings.timerSound}
        onChange={(v) => update({ timerSound: v })}
      />
      <Toggle
        label="إبقاء الشاشة مفتوحة أثناء التحضير"
        checked={settings.keepScreenAwake}
        onChange={(v) => update({ keepScreenAwake: v })}
      />

      <div className="space-y-3 pt-4">
        <button
          type="button"
          onClick={() => clearKey(LAST_BREW_KEY, "انمسحت آخر قهوة")}
          className="w-full rounded-card border border-line bg-card px-5 py-4 text-right text-lg text-muted transition-colors hover:text-foreground"
        >
          مسح آخر الوصفات
        </button>
        <button
          type="button"
          onClick={() => clearKey(FAVORITES_KEY, "انمسحت المفضلة")}
          className="w-full rounded-card border border-line bg-card px-5 py-4 text-right text-lg text-muted transition-colors hover:text-foreground"
        >
          مسح المفضلة
        </button>
      </div>

      {cleared ? (
        <p className="text-center text-base text-accent-deep">{cleared} ✓</p>
      ) : null}
    </div>
  );
}
