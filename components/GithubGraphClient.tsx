"use client";

import dynamic from "next/dynamic";

export const GithubGraphClient = dynamic(
  () => import("./github").then((m) => m.GithubGraph),
  {
    ssr: false,
    loading: () => (
      <div className="h-[140px] flex items-center justify-center text-neutral-500">
        Loading GitHub activity…
      </div>
    ),
  }
);
