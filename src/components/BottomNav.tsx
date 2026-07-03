"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  {
    href: "/",
    label: "الرئيسية",
    icon: (
      <path d="M4 11.5 12 5l8 6.5M6.5 10v8.2c0 .7.6 1.3 1.3 1.3h8.4c.7 0 1.3-.6 1.3-1.3V10" />
    ),
  },
  {
    href: "/recipes",
    label: "الوصفات",
    icon: (
      <path d="M6 4.5h9.5c1.4 0 2.5 1.1 2.5 2.5v10c0 1.4-1.1 2.5-2.5 2.5H6a1.5 1.5 0 0 1-1.5-1.5v-12A1.5 1.5 0 0 1 6 4.5Zm0 0v15M9.5 9H14m-4.5 3.5H14" />
    ),
  },
  {
    href: "/settings",
    label: "الإعدادات",
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 4v2.2m0 11.6V20m8-8h-2.2M6.2 12H4m13.7-5.7-1.6 1.6M7.9 16.1l-1.6 1.6m11.4 0-1.6-1.6M7.9 7.9 6.3 6.3" />
      </>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  // Guided brewing and the brew flow need full focus — no navigation bar.
  if (pathname.startsWith("/brew")) return null;

  return (
    <nav
      aria-label="التنقل الرئيسي"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-24 flex-col items-center gap-1 rounded-full px-5 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "bg-background/60 text-accent-deep"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
                aria-hidden
              >
                {item.icon}
              </svg>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
