import React from "react";

import { ComponentDependencies } from "@/components/libs/react-flow";

export default async function App({
  params,
}: Readonly<{
  params: Promise<{ lang: string }>;
}>) {
  const lang = (await params).lang;
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ComponentDependencies lang={lang} />
    </div>
  );
}
