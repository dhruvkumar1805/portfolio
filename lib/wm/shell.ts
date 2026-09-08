import { projects, siteConfig, work } from "@/lib/site-config";
import { nodeAt, pathLabel, resolve } from "./fs";
import type { AppId } from "./types";

export type Tone = "normal" | "dim" | "accent" | "error";

export type Line = { text: string; tone?: Tone; href?: string };

export type Effect =
  | { type: "clear" }
  | { type: "open-app"; app: AppId }
  | { type: "open-url"; url: string }
  | { type: "theme" }
  | { type: "exit" }
  | { type: "pet" }
  | { type: "keys" };

export type ShellContext = {
  cwd: string[];
  bootedAt: number;
  theme: string;
  clients: { title: string; workspace: number; focused: boolean; floating: boolean }[];
  workspace: number;
};

export type ShellResult = { lines: Line[]; effects: Effect[]; cwd: string[] };

const dim = (text: string): Line => ({ text, tone: "dim" });
const err = (text: string): Line => ({ text, tone: "error" });
const accent = (text: string): Line => ({ text, tone: "accent" });

const COMMANDS: [string, string][] = [
  ["ls [dir]", "list what is in here"],
  ["cd <dir>", "move around"],
  ["cat <file>", "read a file"],
  ["open <name>", "open a window, a project, or a link"],
  ["neofetch", "the obligatory system readout"],
  ["man dhruv", "the manual page, written properly"],
  ["hyprctl clients", "list live windows, like the real thing"],
  ["curl dhruvkumar.dev", "the résumé, in plain text"],
  ["whoami", "short version"],
  ["theme", "flip light and dark"],
  ["nekopet", "let the cat out"],
  ["keys", "keybind cheatsheet"],
  ["clear", "wipe the scrollback"],
  ["exit", "back to the normal site"],
];

const MAN_PAGE: Line[] = [
  { text: "DHRUV(1)                      User Commands                     DHRUV(1)" },
  { text: "" },
  { text: "NAME", tone: "accent" },
  { text: "       dhruv - builds systems, then goes a layer deeper" },
  { text: "" },
  { text: "SYNOPSIS", tone: "accent" },
  { text: "       dhruv [--rag] [--realtime] [--rust] [--rls] < problem" },
  { text: "" },
  { text: "DESCRIPTION", tone: "accent" },
  { text: "       Pitches, designs, builds and deploys production systems solo." },
  { text: "       Reads the layer underneath before trusting it. Started in" },
  { text: "       Android device trees in 2021 and never fully came back up." },
  { text: "" },
  { text: "OPTIONS", tone: "accent" },
  { text: "       --solo     the default. one engineer, whole system" },
  { text: "       --deep     opens the source of the dependency, not the docs" },
  { text: "       --break    finds the hole before someone else does" },
  { text: "       --ship     no flag needed, it is implied" },
  { text: "" },
  { text: "EXIT STATUS", tone: "accent" },
  { text: "       0    shipped" },
  { text: "       1    still shipping" },
  { text: "" },
  { text: "BUGS", tone: "accent" },
  { text: "       Parses /dev/input by hand. Sleeps later than advertised." },
  { text: "" },
  { text: "SEE ALSO", tone: "accent" },
  { text: "       nekopet(1), curl(1), dhruvkumar.dev" },
];

const CAT = [
  "     /\\_/\\  ",
  "    ( o.o ) ",
  "     > ^ <  ",
  "    /|   |\\ ",
  "   (_|   |_)",
];

function uptime(bootedAt: number): string {
  const secs = Math.max(1, Math.round((Date.now() - bootedAt) / 1000));
  if (secs < 60) return `${secs} secs`;
  const mins = Math.floor(secs / 60);
  return `${mins} min${mins === 1 ? "" : "s"}, ${secs % 60} secs`;
}

function neofetch(ctx: ShellContext): Line[] {
  const info: [string, string][] = [
    ["OS", "Arch Linux x86_64"],
    ["Host", "portfolio.wm"],
    ["Kernel", "7.1.9-arch1-2"],
    ["Uptime", uptime(ctx.bootedAt)],
    ["WM", "dwindle, written for this page"],
    ["Shell", "dksh 1.0"],
    ["Theme", ctx.theme],
    ["CPU", "whatever your browser is on"],
    ["Role", "AI / full-stack engineer"],
    ["Now", `${work[0].role} @ ${work[0].org}`],
    ["Shipped", projects.slice(0, 2).map((p) => p.hrefLabel).join(", ")],
  ];

  const head = `${"dhruv"}@arch`;
  const rows: Line[] = [
    accent(head),
    dim("-".repeat(head.length)),
    ...info.map(({ 0: k, 1: v }) => ({ text: `${k}: ${v}` })),
  ];

  const height = Math.max(CAT.length, rows.length);
  const out: Line[] = [];
  for (let i = 0; i < height; i += 1) {
    const art = (CAT[i] ?? " ".repeat(12)).padEnd(14);
    const row = rows[i];
    out.push(
      row
        ? { text: `${art}${row.text}`, tone: row.tone }
        : { text: art, tone: "accent" },
    );
  }
  return out;
}

function resumeText(): Line[] {
  const rule = "─".repeat(46);
  return [
    accent(`  ${siteConfig.name.toUpperCase()}`),
    dim(`  ${rule}`),
    { text: "  AI / full-stack engineer · Punjab, India" },
    { text: "" },
    dim("  NOW"),
    { text: `  ${work[0].role}, ${work[0].org}` },
    { text: "  Sole engineer on a multi-tenant agency platform." },
    { text: "  Closed 35+ vulns across 26 fixes. Cut bundles 92%." },
    { text: "" },
    dim("  SHIPPED"),
    ...projects.map((p) => ({
      text: `  ${p.title.padEnd(30)} ${p.metricValue ?? ""} ${p.metricLabel ?? ""}`.trimEnd(),
    })),
    { text: "" },
    dim("  REACH"),
    { text: `  ${siteConfig.email}` },
    { text: `  ${siteConfig.github}` },
    dim(`  ${rule}`),
    { text: "" },
    dim("  $ curl -O dhruvkumar.dev/resume.pdf   # the real one"),
  ];
}

export function run(input: string, ctx: ShellContext): ShellResult {
  const trimmed = input.trim();
  const cwd = ctx.cwd;
  if (!trimmed) return { lines: [], effects: [], cwd };

  const [cmd, ...args] = trimmed.split(/\s+/);
  const arg = args.join(" ");
  const none = (lines: Line[]): ShellResult => ({ lines, effects: [], cwd });

  switch (cmd) {
    case "help":
      return none([
        dim("commands, tab completes:"),
        ...COMMANDS.map(({ 0: c, 1: d }) => ({ text: `  ${c.padEnd(22)}${d}` })),
        { text: "" },
        dim("windows are tiled, not stacked. SUPER+/ shows every keybind."),
      ]);

    case "keys":
      return { lines: [], effects: [{ type: "keys" }], cwd };

    case "ls": {
      const path = resolve(cwd, arg || ".");
      const node = path && nodeAt(path);
      if (!node) return none([err(`ls: ${arg}: no such file or directory`)]);
      if (node.kind === "file") return none([{ text: node.name }]);
      return none(
        node.children.map((c) =>
          c.kind === "dir"
            ? { text: `${c.name}/`, tone: "accent" as Tone }
            : { text: c.name },
        ),
      );
    }

    case "cd": {
      if (!arg || arg === "~") return { lines: [], effects: [], cwd: [] };
      const path = resolve(cwd, arg);
      const node = path && nodeAt(path);
      if (!node) return none([err(`cd: ${arg}: no such file or directory`)]);
      if (node.kind !== "dir") return none([err(`cd: ${arg}: not a directory`)]);
      return { lines: [], effects: [], cwd: path };
    }

    case "pwd":
      return none([{ text: pathLabel(cwd) }]);

    case "cat": {
      if (!arg) return none([err("cat: which file?")]);
      const path = resolve(cwd, arg);
      const node = path && nodeAt(path);
      if (!node) return none([err(`cat: ${arg}: no such file or directory`)]);
      if (node.kind === "dir") return none([err(`cat: ${arg}: is a directory`)]);
      if (!node.body && node.open) {
        return {
          lines: [dim(`opening ${node.name}…`)],
          effects: [{ type: "open-url", url: node.open }],
          cwd,
        };
      }
      return none(
        node.body.split("\n").map((text) => ({
          text,
          tone: text.startsWith("#") ? ("accent" as Tone) : undefined,
        })),
      );
    }

    case "open": {
      if (!arg) return none([err("open: what?")]);
      const project = projects.find((p) => p.slug === arg || p.title.toLowerCase() === arg);
      if (project) {
        return {
          lines: [dim(`opening ${project.href}`)],
          effects: [{ type: "open-url", url: project.href }],
          cwd,
        };
      }
      const apps: AppId[] = ["about", "projects", "work", "stack", "contact", "resume", "terminal"];
      const app = apps.find((a) => a === arg);
      if (app) {
        return { lines: [], effects: [{ type: "open-app", app }], cwd };
      }
      if (/^https?:\/\//.test(arg) || arg.includes(".")) {
        const url = /^https?:\/\//.test(arg) ? arg : `https://${arg}`;
        return { lines: [dim(`opening ${url}`)], effects: [{ type: "open-url", url }], cwd };
      }
      return none([err(`open: ${arg}: nothing by that name`)]);
    }

    case "neofetch":
      return none(neofetch(ctx));

    case "man": {
      if (args[0] && args[0] !== "dhruv") {
        return none([err(`No manual entry for ${args[0]}`), dim("try `man dhruv`.")]);
      }
      return none(MAN_PAGE);
    }

    case "whoami":
      return none([
        { text: "dhruv" },
        dim("AI / full-stack engineer. Ships production systems solo,"),
        dim("then reads the layer underneath before trusting it."),
      ]);

    case "uname":
      return none([
        {
          text:
            args[0] === "-a"
              ? "Linux arch 7.1.9-arch1-2 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux"
              : "Linux",
        },
      ]);

    case "hyprctl": {
      const sub = args[0] ?? "clients";
      if (sub === "workspaces") {
        const counts = new Map<number, number>();
        for (const c of ctx.clients) counts.set(c.workspace, (counts.get(c.workspace) ?? 0) + 1);
        return none(
          Array.from({ length: 5 }, (_, i) => ({
            text: `workspace ID ${i + 1} (${i + 1}): ${counts.get(i) ?? 0} windows${
              i === ctx.workspace ? "  <- active" : ""
            }`,
            tone: i === ctx.workspace ? ("accent" as Tone) : undefined,
          })),
        );
      }
      if (sub === "monitors") {
        return none([
          accent("Monitor browser-0 (ID 0):"),
          {
            text:
              typeof window !== "undefined"
                ? `\t${window.innerWidth}x${window.innerHeight}@${
                    typeof screen !== "undefined" ? 60 : 60
                  }.00 at 0x0`
                : "\tunknown",
          },
          dim("\tdescription: your actual display, borrowed"),
        ]);
      }
      if (!ctx.clients.length) return none([dim("no windows open")]);
      return none(
        ctx.clients.flatMap((c) => [
          { text: `Window ${c.title}`, tone: c.focused ? ("accent" as Tone) : undefined },
          dim(`\tworkspace: ${c.workspace + 1}`),
          dim(`\tfloating: ${c.floating ? 1 : 0}`),
        ]),
      );
    }

    case "curl": {
      if (!arg || arg.includes("dhruvkumar.dev") || arg.includes("resume")) {
        return none(resumeText());
      }
      return none([dim(`curl: (6) could not resolve host: ${arg}`)]);
    }

    case "theme":
      return { lines: [], effects: [{ type: "theme" }], cwd };

    case "nekopet":
      return {
        lines: [dim("nekopet: spawned. it walks the desktop and watches your cursor.")],
        effects: [{ type: "pet" }],
        cwd,
      };

    case "date":
      return none([
        {
          text: new Date().toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
            dateStyle: "full",
            timeStyle: "medium",
          }) + " IST",
        },
      ]);

    case "echo":
      return none([{ text: arg }]);

    case "clear":
      return { lines: [], effects: [{ type: "clear" }], cwd };

    case "exit":
    case "logout":
      return { lines: [dim("logging out…")], effects: [{ type: "exit" }], cwd };

    case "sudo":
      return none([
        err("dhruv is not in the sudoers file. This incident has been reported."),
      ]);

    case "rm":
      return none([
        args.includes("-rf") && (args.includes("/") || args.includes("/*"))
          ? err("rm: it is a browser tab. You are fine.")
          : err("rm: this filesystem is read-only, like a résumé should be"),
      ]);

    case "vim":
    case "vi":
      return none([dim("no. use `cat`, then go read the real repo on GitHub.")]);

    default:
      return none([
        err(`${cmd}: command not found`),
        dim("`help` lists what this shell actually knows."),
      ]);
  }
}

export function complete(input: string, cwd: string[]): string {
  const parts = input.split(/\s+/);
  const last = parts[parts.length - 1] ?? "";

  if (parts.length === 1) {
    const names = [
      ...COMMANDS.map((c) => c[0].split(" ")[0]),
      "pwd",
      "whoami",
      "uname",
      "date",
      "echo",
      "help",
    ];
    const hit = names.find((n) => n.startsWith(last) && n !== last);
    return hit ? hit : input;
  }

  const dir = nodeAt(cwd);
  if (dir?.kind !== "dir") return input;
  const hit = dir.children.find((c) => c.name.startsWith(last) && c.name !== last);
  if (!hit) return input;
  return [...parts.slice(0, -1), hit.name].join(" ");
}
