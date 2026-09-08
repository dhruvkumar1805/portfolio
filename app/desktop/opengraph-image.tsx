import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#181818";
const INK_2 = "#5c5c5c";
const INK_3 = "#999999";
const LINE = "#e6e6e6";
const PAPER_2 = "#f6f6f6";
const ACCENT = "#e0642a";

/* The OG renderer only has a sans font, so the readout is laid out in columns
   rather than padded with spaces. */
const READOUT: [string, string][] = [
  ["OS", "Arch Linux x86_64"],
  ["WM", "dwindle, written for this page"],
  ["Shell", "dksh 1.0"],
  ["Uptime", "8 secs"],
  ["Role", "AI / full-stack engineer"],
  ["Now", "Founding FS AI Engineer @ Nomara"],
  ["Shipped", "solvochat.com, bunnyscafe.in"],
];

export default async function DesktopOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            height: 54,
            padding: "0 22px",
            background: PAPER_2,
            borderBottom: `1px solid ${LINE}`,
            fontSize: 19,
            letterSpacing: 2,
            color: INK_3,
          }}
        >
          <div style={{ display: "flex" }}>DHRUV@ARCH</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 30,
                  height: 30,
                  borderRadius: 7,
                  background: n === 1 ? ACCENT : "transparent",
                  color: n === 1 ? "#ffffff" : INK_3,
                  fontSize: 18,
                  letterSpacing: 0,
                }}
              >
                {n}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flex: 1 }}>ABOUT.MD</div>
          <div style={{ display: "flex", color: INK_2 }}>14:52 IST</div>
        </div>

        {/* tiled windows */}
        <div style={{ display: "flex", flex: 1, gap: 14, padding: 16 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 660,
              border: `2px solid ${ACCENT}`,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                height: 42,
                padding: "0 16px",
                background: PAPER_2,
                borderBottom: `1px solid ${LINE}`,
                fontSize: 17,
                letterSpacing: 2,
                color: INK_2,
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 9,
                  height: 9,
                  borderRadius: 999,
                  background: ACCENT,
                }}
              />
              ABOUT.MD
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                padding: 30,
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    fontSize: 25,
                    letterSpacing: 2,
                    color: INK_3,
                  }}
                >
                  {siteConfig.name.toUpperCase()}
                </div>
                <div
                  style={{
                    display: "flex",
                    marginTop: 20,
                    fontSize: 56,
                    fontWeight: 600,
                    letterSpacing: -2,
                    color: INK,
                    lineHeight: 1.12,
                  }}
                >
                  A portfolio that runs as a tiling window manager
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 24,
                  color: INK_2,
                  lineHeight: 1.4,
                }}
              >
                Real dwindle splits, five workspaces, a shell that answers back, and a
                cat that walks over the windows.
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              border: `1px solid ${LINE}`,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                height: 42,
                padding: "0 16px",
                background: PAPER_2,
                borderBottom: `1px solid ${LINE}`,
                fontSize: 17,
                letterSpacing: 2,
                color: INK_3,
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 9,
                  height: 9,
                  borderRadius: 999,
                  background: INK_3,
                }}
              />
              DHRUV@ARCH:~
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: 22,
                fontSize: 20,
                lineHeight: 1.5,
                color: INK_2,
              }}
            >
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ display: "flex", color: ACCENT }}>~ $</div>
                <div style={{ display: "flex", color: INK }}>neofetch</div>
              </div>
              <div style={{ display: "flex", marginTop: 6, color: ACCENT }}>
                dhruv@arch
              </div>
              <div style={{ display: "flex", flexDirection: "column", marginTop: 4 }}>
                {READOUT.map(({ 0: key, 1: value }) => (
                  <div key={key} style={{ display: "flex", gap: 10 }}>
                    <div style={{ display: "flex", width: 96, color: INK_3 }}>{key}</div>
                    <div style={{ display: "flex", flex: 1 }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <div style={{ display: "flex", color: ACCENT }}>~ $</div>
                <div
                  style={{
                    display: "flex",
                    width: 11,
                    height: 24,
                    background: ACCENT,
                    opacity: 0.7,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 22px 20px",
            fontSize: 22,
            fontWeight: 600,
            color: ACCENT,
          }}
        >
          <div
            style={{ display: "flex", width: 10, height: 10, borderRadius: 999, background: ACCENT }}
          />
          {siteConfig.url.replace("https://", "")}/desktop
        </div>
      </div>
    ),
    { ...size },
  );
}
