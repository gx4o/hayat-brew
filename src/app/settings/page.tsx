import { SettingsPanel } from "@/components/SettingsPanel";

export const metadata = { title: "الإعدادات — Hayat Brew" };

export default function SettingsPage() {
  return (
    <main className="mx-auto w-full max-w-xl px-5 pb-32 pt-12">
      <h1 className="font-display text-4xl font-bold">الإعدادات</h1>
      <SettingsPanel />
    </main>
  );
}
