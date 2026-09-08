import { education, projects, siteConfig, stack, work } from "@/lib/site-config";

export type FsNode =
  | { kind: "file"; name: string; body: string; open?: string }
  | { kind: "dir"; name: string; children: FsNode[] };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function projectFile(p: (typeof projects)[number]): FsNode {
  const lines = [
    `# ${p.title}`,
    "",
    p.tag,
    "",
    p.description,
    "",
    p.metricValue ? `${p.metricValue}  ${p.metricLabel ?? ""}`.trim() : "",
    "",
    `stack: ${p.stack.join(", ")}`,
    `live:  ${p.href}`,
    p.caseStudyHref ? `read:  ${siteConfig.url}${p.caseStudyHref}` : "",
    "",
    ...(p.stats ?? []).map((s) => `${s.label.padEnd(14)}${s.value}`),
  ];
  return {
    kind: "file",
    name: `${p.slug}.md`,
    body: lines.filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n"),
    open: p.href,
  };
}

function workFile(w: (typeof work)[number]): FsNode {
  const lines = [
    `# ${w.role}`,
    `@ ${w.org}  ·  ${w.period}`,
    "",
    ...w.points.flatMap((point) => [`- ${point}`, ""]),
    `stack: ${w.stack.join(", ")}`,
  ];
  return { kind: "file", name: `${slugify(w.org)}.md`, body: lines.join("\n") };
}

const readme = [
  `# ${siteConfig.name}`,
  "",
  "AI / full-stack engineer. Punjab, India.",
  "",
  "I build systems, then go a layer deeper and break them before someone",
  "else does. RAG pipelines that cite their sources, a client platform's",
  "RLS closed hole by hole, a Rust desktop pet that talks straight to",
  "Wayland.",
  "",
  "You are inside a tiling window manager written in TypeScript, running",
  "in your browser. It is not a screenshot. Try `help`, or press SUPER+/",
  "for the keybinds.",
  "",
  `  site     ${siteConfig.url}`,
  `  github   ${siteConfig.github}`,
  `  email    ${siteConfig.email}`,
].join("\n");

const contact = [
  "# contact",
  "",
  `email      ${siteConfig.email}`,
  `github     ${siteConfig.github}`,
  `linkedin   ${siteConfig.linkedin}`,
  `x          ${siteConfig.twitter}`,
  `location   ${siteConfig.location}  ·  ${siteConfig.timezone}`,
  "",
  "Open to interesting problems. Email lands fastest.",
].join("\n");

const educationFile = [
  `# ${education.degree}`,
  `${education.school}  ·  ${education.location}`,
  education.period,
  "",
  education.note,
].join("\n");

export const HOME: FsNode = {
  kind: "dir",
  name: "~",
  children: [
    { kind: "file", name: "README.md", body: readme },
    {
      kind: "dir",
      name: "projects",
      children: projects.map(projectFile),
    },
    {
      kind: "dir",
      name: "work",
      children: work.map(workFile),
    },
    {
      kind: "dir",
      name: "stack",
      children: stack.map((category) => ({
        kind: "file" as const,
        name: `${slugify(category.category)}.txt`,
        body: [
          `# ${category.category}`,
          "",
          ...category.tools.map(
            (t) => `${t.daily ? "*" : " "} ${t.name.padEnd(16)}${t.note}`,
          ),
          "",
          "* = daily driver",
        ].join("\n"),
      })),
    },
    { kind: "file", name: "contact.txt", body: contact },
    { kind: "file", name: "education.txt", body: educationFile },
    { kind: "file", name: "resume.pdf", body: "", open: siteConfig.resume },
  ],
};

export function resolve(cwd: string[], arg: string): string[] | null {
  const parts = arg.split("/").filter(Boolean);
  let path = arg.startsWith("/") || arg.startsWith("~") ? [] : [...cwd];

  for (const part of parts) {
    if (part === "~" || part === ".") continue;
    if (part === "..") {
      path.pop();
      continue;
    }
    path = [...path, part];
  }
  return path;
}

export function nodeAt(path: string[]): FsNode | null {
  let node: FsNode = HOME;
  for (const part of path) {
    if (node.kind !== "dir") return null;
    const next = node.children.find((c) => c.name === part);
    if (!next) return null;
    node = next;
  }
  return node;
}

export const pathLabel = (path: string[]) => ["~", ...path].join("/");
