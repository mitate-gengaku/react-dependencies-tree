import { GeistSans } from "geist/font/sans";
import { dir } from "i18next";
import { Noto_Sans_JP } from "next/font/google";

import type { Metadata } from "next";

import "../globals.css";
import "@xyflow/react/dist/style.css";
import { Toaster } from "@/components/ui/sonner";

const NotoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--noto-sans-jp",
});

export const metadata: Metadata = {
  title: "React Dependencies Tree | Reactコンポーネントの結合探索ツール",
};

export default function RootLayout({
  children,
  params: { lang },
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  return (
    <html lang={lang} dir={dir(lang)}>
      <body
        className={`${GeistSans.className} ${NotoSansJP.variable} antialiased`}
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
