import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const thmanyahSans = localFont({
  src: [
    { path: "../fonts/thmanyahsans-Regular.woff2", weight: "400" },
    { path: "../fonts/thmanyahsans-Medium.woff2", weight: "500" },
    { path: "../fonts/thmanyahsans-Bold.woff2", weight: "700" },
    { path: "../fonts/thmanyahsans-Black.woff2", weight: "900" },
  ],
  variable: "--font-thmanyah-sans",
  display: "swap",
});

const thmanyahSerif = localFont({
  src: [
    { path: "../fonts/thmanyahserifdisplay-Medium.woff2", weight: "500" },
    { path: "../fonts/thmanyahserifdisplay-Bold.woff2", weight: "700" },
  ],
  variable: "--font-thmanyah-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hayat Brew",
  description: "حاسبة وصفات القهوة ودليل التحضير للعائلة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${thmanyahSans.variable} ${thmanyahSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
