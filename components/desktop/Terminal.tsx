"use client";

import { useEffect, useRef, useState } from "react";
import { complete, run, type Line } from "@/lib/wm/shell";
import { pathLabel } from "@/lib/wm/fs";
import { useWm } from "./wm-context";

const WELCOME: Line[] = [
  { text: "dksh 1.0 — this shell is real, the machine is a browser tab", tone: "dim" },
  { text: "type `help`, or `neofetch` if you are in a hurry", tone: "dim" },
  { text: "" },
];

const TONE: Record<string, string> = {
  dim: "text-ink-3",
  accent: "text-accent-text",
  error: "text-accent-text",
  normal: "text-ink-2",
};

function LineOut({ line }: { line: Line }) {
  const cls = TONE[line.tone ?? "normal"] ?? TONE.normal;
  const tokens = line.text.split(/(\s+)/);

  return (
    <div className={`whitespace-pre-wrap ${cls}`}>
      {tokens.map((token, i) =>
        /^https?:\/\/\S+$/.test(token) ? (
          <a
            key={i}
            href={token}
            target="_blank"
            rel="noreferrer"
            className="text-accent-2 underline underline-offset-2"
          >
            {token}
          </a>
        ) : (
          <span key={i}>{token}</span>
        ),
      )}
    </div>
  );
}

export default function Terminal({
  id,
  focused,
  autoRun,
}: {
  id: string;
  focused: boolean;
  autoRun?: string;
}) {
  const { state, openApp, exit, toggleTheme, togglePet, showKeys, bootedAt } = useWm();
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef<(entry: string) => void>(() => {});

  useEffect(() => {
    if (focused) inputRef.current?.focus({ preventScroll: true });
  }, [focused]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  useEffect(() => {
    submitRef.current = submit;
  });

  /**
   * The session's first terminal types its own opening command, so the page is
   * already doing something when someone lands on it. Any key or click hands
   * control straight back.
   */
  useEffect(() => {
    if (!autoRun) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const cancel = () => {
      if (cancelled) return;
      cancelled = true;
      clearTimeout(timer);
      setInput("");
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timer = setTimeout(() => submitRef.current(autoRun), 150);
    } else {
      let typed = 0;
      const typeNext = () => {
        if (cancelled) return;
        typed += 1;
        setInput(autoRun.slice(0, typed));
        timer =
          typed < autoRun.length
            ? setTimeout(typeNext, 52 + Math.random() * 46)
            : setTimeout(() => {
                if (!cancelled) submitRef.current(autoRun);
              }, 360);
      };
      timer = setTimeout(typeNext, 620);
    }

    window.addEventListener("keydown", cancel);
    window.addEventListener("pointerdown", cancel);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", cancel);
      window.removeEventListener("pointerdown", cancel);
    };
  }, [autoRun]);

  const prompt = `${pathLabel(cwd)} ❯`;

  function submit(entry = input) {
    const echo: Line = { text: `${prompt} ${entry}`, tone: "normal" };

    const theme =
      typeof document !== "undefined" &&
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";

    const result = run(entry, {
      cwd,
      bootedAt,
      theme,
      workspace: state.workspace,
      clients: Object.values(state.windows).map((w) => ({
        title: w.title,
        workspace: w.workspace,
        focused: state.focus[w.workspace] === w.id,
        floating: w.floating,
      })),
    });

    let cleared = false;
    for (const effect of result.effects) {
      switch (effect.type) {
        case "clear":
          cleared = true;
          break;
        case "open-app":
          openApp(effect.app);
          break;
        case "open-url":
          window.open(effect.url, "_blank", "noopener,noreferrer");
          break;
        case "theme":
          toggleTheme();
          break;
        case "pet":
          togglePet();
          break;
        case "keys":
          showKeys();
          break;
        case "exit":
          setTimeout(exit, 240);
          break;
      }
    }

    setCwd(result.cwd);
    setLines(cleared ? [] : (prev) => [...prev, echo, ...result.lines]);
    if (entry.trim()) setHistory((prev) => [...prev, entry]);
    setCursor(-1);
    setInput("");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.altKey || e.metaKey) return;

    if (e.key === "Enter") {
      e.preventDefault();
      submit();
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      setInput((value) => complete(value, cwd));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = cursor < 0 ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setInput(history[next]);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cursor < 0) return;
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(-1);
        setInput("");
        return;
      }
      setCursor(next);
      setInput(history[next]);
      return;
    }

    if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setLines([]);
      return;
    }

    if (e.ctrlKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      setLines((prev) => [...prev, { text: `${prompt} ${input}^C`, tone: "dim" }]);
      setInput("");
    }
  }

  return (
    <div
      ref={scrollRef}
      onPointerDown={() => inputRef.current?.focus({ preventScroll: true })}
      className="wm-scroll h-full cursor-text overflow-y-auto bg-paper px-3 py-2.5 font-mono-tight text-[11.5px] leading-[1.55]"
    >
      {lines.map((line, i) => (
        <LineOut key={`${id}-${i}`} line={line} />
      ))}

      <div className="flex items-baseline gap-1.5">
        <span className="shrink-0 text-accent-text">{prompt}</span>
        <span className="relative min-w-0 flex-1">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Shell input"
            className="w-full bg-transparent font-mono-tight text-[11.5px] text-ink outline-none"
          />
          {focused && !input && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-[2px] left-0 h-[13px] w-[6.5px] animate-pulse bg-accent-2/70"
            />
          )}
        </span>
      </div>
    </div>
  );
}
