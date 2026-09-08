import { projects, siteConfig, stack, work } from "@/lib/site-config";

/**
 * The résumé as a terminal serves it. `curl dhruvkumar.dev` from a shell gets
 * this instead of the HTML, decided by User-Agent in middleware.
 */

const ESC = `${String.fromCharCode(27)}[`;
const RESET = `${ESC}0m`;

const c = {
  accent: (s: string) => `${ESC}38;5;173m${s}${RESET}`,
  bold: (s: string) => `${ESC}1m${s}${RESET}`,
  dim: (s: string) => `${ESC}2m${s}${RESET}`,
};

const WIDTH = 66;

/** Column padding has to count characters the terminal will actually show. */
function visibleLength(s: string): number {
  return s
    .split(ESC)
    .map((part, i) => (i === 0 ? part : part.replace(/^[0-9;]*m/, "")))
    .join("").length;
}

function row(content = ""): string {
  const pad = Math.max(0, WIDTH - visibleLength(content));
  return c.dim("│ ") + content + " ".repeat(pad) + c.dim(" │");
}

const top = c.dim(`╭${"─".repeat(WIDTH + 2)}╮`);
const bottom = c.dim(`╰${"─".repeat(WIDTH + 2)}╯`);
const rule = c.dim(`├${"─".repeat(WIDTH + 2)}┤`);

function heading(text: string): string[] {
  return [row(), row(c.accent(text))];
}

function wrap(text: string, width = WIDTH - 2): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if ((line + word).length + 1 > width) {
      lines.push(line.trimEnd());
      line = "";
    }
    line += `${word} `;
  }
  if (line.trim()) lines.push(line.trimEnd());
  return lines;
}

export function cliResume(): string {
  const daily = stack
    .flatMap((category) => category.tools.filter((t) => t.daily).map((t) => t.name))
    .join(", ");

  const lines: string[] = [
    "",
    "  " + top,
    "  " + row(),
    "  " + row(`  ${c.bold(c.accent(siteConfig.name.toUpperCase()))}`),
    "  " + row(`  ${c.dim("AI / full-stack engineer · Punjab, India · UTC+5:30")}`),
    "  " + row(),
    "  " + rule,
  ];

  const push = (rows: string[]) => lines.push(...rows.map((r) => "  " + r));

  push(heading("  NOW"));
  push([
    row(`  ${c.bold(work[0].role)}`),
    row(`  ${c.dim(`${work[0].org} · ${work[0].period}`)}`),
  ]);
  push(wrap(work[0].points[1], WIDTH - 4).map((l) => row(`  ${l}`)));

  push(heading("  SHIPPED"));
  for (const project of projects) {
    const metric = project.metricValue
      ? c.accent(project.metricValue.padStart(6))
      : " ".repeat(6);
    push([
      row(`  ${project.title.slice(0, 40).padEnd(42)}${metric}  ${c.dim(project.hrefLabel)}`),
    ]);
  }

  push(heading("  DAILY"));
  push(wrap(daily, WIDTH - 4).map((l) => row(`  ${c.dim(l)}`)));

  push(heading("  REACH"));
  push([
    row(`  ${c.dim("email    ")}${siteConfig.email}`),
    row(`  ${c.dim("github   ")}${siteConfig.github}`),
    row(`  ${c.dim("linkedin ")}${siteConfig.linkedin}`),
  ]);

  push([row(), rule, row()]);
  push([
    row(`  ${c.dim("There is a whole tiling window manager on the site:")}`),
    row(`  ${c.accent(`${siteConfig.url}/desktop`)}`),
    row(),
    row(`  ${c.dim(`$ curl -O ${siteConfig.url.replace("https://", "")}/resume.pdf`)}`),
    row(),
    bottom,
  ]);

  lines.push("");
  return lines.join("\n") + "\n";
}
