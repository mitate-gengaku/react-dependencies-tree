import "../globals.css";
import "@xyflow/react/dist/style.css";

import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from "geist/font/sans";
import { dir } from "i18next";
import { Noto_Sans_JP } from "next/font/google";

import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";
import { getTranslation } from "@/i18n/server";

const NotoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--noto-sans-jp",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const lang = (await params).lang;
  const { t } = await getTranslation(lang);

  return {
    title: t("meta:title"),
    description: t("meta:description"),
    applicationName: "React Dependencies Tree",
    authors: [{ name: "Mitate Gengaku", url: "https://mitate-gengaku.com" }],
    generator: "Next.js",
    keywords: ["react", "nextjs", "server components", "react-flow"],
    creator: "Mitate Gengaku",
    publisher: "Mitate Gengaku",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL("https://www.react-dependencies-tree.com"),
    category: "technology",
    openGraph: {
      title: t("meta:title"),
      description: t("meta:description"),
      url: "https://www.react-dependencies-tree.com",
      siteName: "React Dependencies Tree",
      // images: []
      locale: lang,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: t("meta:title"),
      description: t("meta:description"),
      creator: "@mitate-gengaku",
      creatorId: "1776914915519045632",
      // images
    },
    // icons: ""
  };
}

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
