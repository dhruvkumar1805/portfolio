"use client";

import { usePathname } from "next/navigation";
import Nav from "@/components/nav/Nav";
import ScrollProgress from "@/components/ui/ScrollProgress";
import StatusBar from "@/components/ui/StatusBar";

/**
 * The desktop session takes over the viewport and binds its own keys, so the
 * site chrome stays unmounted there rather than merely hidden: a mounted Nav
 * would keep its global shortcuts live underneath the window manager.
 */
export default function SiteChrome() {
  const pathname = usePathname();
  if (pathname?.startsWith("/desktop")) return null;

  return (
    <>
      <ScrollProgress />
      <Nav />
      <StatusBar />
    </>
  );
}
