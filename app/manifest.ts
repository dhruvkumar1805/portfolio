import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#e0642a",
    icons: [
      {
        src: "/images/avatar.jpg",
        sizes: "any",
        type: "image/jpeg",
      },
    ],
  };
}
