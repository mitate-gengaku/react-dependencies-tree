import { GeistSans } from "geist/font/sans";
import { dir } from "i18next";
import { Noto_Sans_JP } from "next/font/google";

import type { Metadata } from "next";

import "../globals.css";
import "@xyflow/react/dist/style.css";
import { Toaster } from "@/components/ui/sonner";

import { Analytics } from "@vercel/analytics/react";

const NotoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--noto-sans-jp",
});

export const metadata: Metadata = {
  title: "React Dependencies Tree | Reactコンポーネントの結合探索ツール",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const lang = (await params).lang;

  return (
    <html lang={lang} dir={dir(lang)}>
      <body
        className={`${GeistSans.className} ${NotoSansJP.variable} antialiased`}
      >
        {children}
        <Analytics />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
