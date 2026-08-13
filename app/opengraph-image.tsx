import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 24,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#999999",
            }}
          >
            AI / full-stack engineer
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 120,
              fontWeight: 600,
              letterSpacing: -4,
              color: "#181818",
            }}
          >
            {siteConfig.name}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            borderTop: "2px solid #e8e8e8",
            paddingTop: 32,
            fontSize: 30,
            color: "#5c5c5c",
            maxWidth: 980,
          }}
        >
          {siteConfig.ogDescription}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 26,
            color: "#e0642a",
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#e0642a",
            }}
          />
          {siteConfig.url.replace("https://", "")}
        </div>
      </div>
    ),
    { ...size }
  );
}
