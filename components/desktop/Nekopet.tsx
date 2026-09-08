"use client";

import { useEffect, useRef } from "react";

/**
 * The browser port of nekopet. The real one is Rust on a wlr-layer-shell
 * surface: it draws over every window and never takes a click. Same contract
 * here, a canvas pinned above the windows with pointer events off.
 */

type State = "walk" | "idle" | "sit" | "sleep" | "alert" | "pounce";

const UNIT = 4; // one pixel of the cat, in CSS px
const FOOT_MARGIN = 18;
const SPEED = 46; // px per second
const NEAR = 150; // cursor distance that makes it look up
const POUNCE = 62; // cursor distance that makes it jump
const IDLE_SIT = 11_000;
const IDLE_SLEEP = 19_000;

type Cat = {
  x: number;
  facing: 1 | -1;
  target: number;
  state: State;
  phase: number;
  hop: number;
  hopVel: number;
  lastMove: number;
  nextWander: number;
  blink: number;
};

function readColors() {
  const style = getComputedStyle(document.documentElement);
  return {
    ink: style.getPropertyValue("--ink").trim() || "#333",
    paper: style.getPropertyValue("--paper").trim() || "#fff",
    accent: style.getPropertyValue("--accent-2").trim() || "#e0642a",
    dim: style.getPropertyValue("--ink-3").trim() || "#888",
  };
}

export default function Nekopet({ size }: { size: { w: number; h: number } }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: -9999, y: -9999, movedAt: 0 });
  const cat = useRef<Cat>({
    x: 120,
    facing: 1,
    target: 120,
    state: "idle",
    phase: 0,
    hop: 0,
    hopVel: 0,
    lastMove: 0,
    nextWander: 0,
    blink: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !size.w || !size.h) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = size.w * dpr;
    canvas.height = size.h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let colors = readColors();
    const onTheme = () => {
      colors = readColors();
    };
    window.addEventListener("themechange", onTheme);

    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointer.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        movedAt: Date.now(),
      };
      cat.current.lastMove = Date.now();
    }
    window.addEventListener("pointermove", onPointerMove);

    const groundY = size.h - FOOT_MARGIN;
    const c = cat.current;
    c.x = Math.min(Math.max(c.x, 40), size.w - 40);
    c.target = c.x;
    c.lastMove = Date.now();

    let raf = 0;
    let prev = performance.now();

    function step(now: number) {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;

      const cat_ = cat.current;
      const p = pointer.current;
      const idleFor = Date.now() - cat_.lastMove;
      const dx = p.x - cat_.x;
      const dy = p.y - (groundY - 7 * UNIT);
      const dist = Math.hypot(dx, dy);

      // Decide what the cat is doing.
      if (dist < POUNCE && idleFor < 2000) {
        if (cat_.state !== "pounce") {
          cat_.state = "pounce";
          cat_.hopVel = 190;
        }
        cat_.facing = dx >= 0 ? 1 : -1;
      } else if (cat_.state === "pounce" && cat_.hop <= 0) {
        cat_.state = "alert";
      } else if (cat_.state !== "pounce") {
        if (dist < NEAR && idleFor < 3000) {
          cat_.state = "alert";
          cat_.facing = dx >= 0 ? 1 : -1;
        } else if (idleFor > IDLE_SLEEP) {
          cat_.state = "sleep";
        } else if (idleFor > IDLE_SIT) {
          cat_.state = "sit";
        } else {
          if (now > cat_.nextWander) {
            cat_.target = 40 + Math.random() * Math.max(1, size.w - 80);
            cat_.nextWander = now + 2600 + Math.random() * 5200;
          }
          cat_.state = Math.abs(cat_.target - cat_.x) > 6 ? "walk" : "idle";
        }
      }

      if (cat_.state === "walk" && !reduce) {
        const dir = cat_.target > cat_.x ? 1 : -1;
        cat_.facing = dir;
        cat_.x += dir * SPEED * dt;
        cat_.phase += dt * 9;
      } else if (cat_.state === "pounce") {
        cat_.x += cat_.facing * 70 * dt;
      } else {
        cat_.phase += dt * 1.6;
      }

      cat_.x = Math.min(Math.max(cat_.x, 26), Math.max(27, size.w - 26));

      // Hop arc for the pounce.
      if (cat_.hopVel !== 0 || cat_.hop > 0) {
        cat_.hop += cat_.hopVel * dt;
        cat_.hopVel -= 620 * dt;
        if (cat_.hop <= 0) {
          cat_.hop = 0;
          cat_.hopVel = 0;
        }
      }

      cat_.blink = (cat_.blink + dt) % 4.4;

      draw(ctx!, cat_, {
        groundY,
        colors,
        pointer: p,
        reduce,
      });

      raf = requestAnimationFrame(step);
    }

    function onVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        prev = performance.now();
        raf = requestAnimationFrame(step);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("themechange", onTheme);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [size.w, size.h]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ width: size.w, height: size.h }}
      className="pointer-events-none absolute inset-0 z-[35]"
    />
  );
}

type DrawCtx = {
  groundY: number;
  colors: ReturnType<typeof readColors>;
  pointer: { x: number; y: number };
  reduce: boolean;
};

function draw(ctx: CanvasRenderingContext2D, cat: Cat, env: DrawCtx) {
  const { groundY, colors } = env;
  const u = UNIT;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();
  ctx.translate(Math.round(cat.x), Math.round(groundY - cat.hop));
  ctx.scale(cat.facing, 1);

  const sitting = cat.state === "sit" || cat.state === "sleep";
  const bob = cat.state === "walk" ? Math.sin(cat.phase) * (u * 0.34) : 0;
  const bodyY = (sitting ? -3.1 : -4.2) * u + bob;
  const headY = (sitting ? -7.4 : -8.4) * u + bob;
  const headX = 3.1 * u;

  const line = (w: number) => {
    ctx.lineWidth = w;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
  };

  // Tail: swings while awake, curls tight while asleep.
  const wag = env.reduce ? 0 : Math.sin(cat.phase * (cat.state === "walk" ? 1 : 0.8));
  ctx.strokeStyle = colors.ink;
  line(u * 1.15);
  ctx.beginPath();
  ctx.moveTo(-4.2 * u, bodyY + u);
  if (sitting) {
    ctx.quadraticCurveTo(-6.4 * u, bodyY + 2.2 * u, -3.4 * u, bodyY + 2.9 * u);
  } else {
    ctx.quadraticCurveTo(
      -6.6 * u,
      bodyY - 0.4 * u + wag * u,
      -5.4 * u,
      bodyY - 3.2 * u + wag * u * 1.6,
    );
  }
  ctx.stroke();

  // Legs, hidden when the cat is sitting.
  if (!sitting) {
    const swing = env.reduce || cat.state !== "walk" ? 0 : Math.sin(cat.phase) * u * 0.9;
    ctx.fillStyle = colors.ink;
    for (const { 0: lx, 1: dir } of [
      [-2.6 * u, 1],
      [-1.1 * u, -1],
      [2.0 * u, -1],
      [3.4 * u, 1],
    ] as [number, number][]) {
      ctx.fillRect(
        Math.round(lx + swing * dir * 0.4),
        Math.round(bodyY + 2.1 * u),
        Math.round(u * 1.1),
        Math.round(2.2 * u - Math.abs(swing * dir) * 0.3),
      );
    }
  }

  // Body.
  ctx.fillStyle = colors.paper;
  ctx.strokeStyle = colors.ink;
  line(u * 0.72);
  ctx.beginPath();
  ctx.ellipse(0, bodyY, 4.3 * u, sitting ? 3.1 * u : 2.5 * u, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Ears, perked when alert.
  const perk = cat.state === "alert" || cat.state === "pounce" ? 0.55 * u : 0;
  for (const side of [-1, 1] as const) {
    ctx.beginPath();
    ctx.moveTo(headX + side * 2.1 * u, headY - 0.6 * u);
    ctx.lineTo(headX + side * 2.5 * u, headY - 3.5 * u - perk);
    ctx.lineTo(headX + side * 0.5 * u, headY - 1.9 * u);
    ctx.closePath();
    ctx.fillStyle = colors.paper;
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(headX + side * 1.9 * u, headY - 1.1 * u);
    ctx.lineTo(headX + side * 2.2 * u, headY - 2.8 * u - perk);
    ctx.lineTo(headX + side * 1.1 * u, headY - 1.8 * u);
    ctx.closePath();
    ctx.fillStyle = colors.accent;
    ctx.fill();
  }

  // Head.
  ctx.fillStyle = colors.paper;
  ctx.beginPath();
  ctx.ellipse(headX, headY, 2.8 * u, 2.5 * u, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Eyes. Pupils lean toward the cursor, which is the whole point of the
  // original: it only knows where the pointer is when it can see it.
  const asleep = cat.state === "sleep";
  const blinking = !asleep && cat.blink > 4.2;
  const eyeY = headY - 0.3 * u;

  for (const side of [-1, 1] as const) {
    const ex = headX + side * 1.15 * u;
    if (asleep || blinking) {
      ctx.strokeStyle = colors.ink;
      line(u * 0.55);
      ctx.beginPath();
      ctx.moveTo(ex - 0.65 * u, eyeY);
      ctx.lineTo(ex + 0.65 * u, eyeY);
      ctx.stroke();
      continue;
    }

    ctx.fillStyle = colors.ink;
    const dx = env.pointer.x - (cat.x + cat.facing * ex);
    const dy = env.pointer.y - (env.groundY - cat.hop + eyeY);
    const len = Math.hypot(dx, dy) || 1;
    const reach = Math.min(1, len / 220) * 0.42 * u;
    const px = (dx / len) * reach * cat.facing;
    const py = (dy / len) * reach;

    ctx.beginPath();
    ctx.arc(ex + px, eyeY + py, 0.62 * u, 0, Math.PI * 2);
    ctx.fill();
  }

  // Nose and whiskers.
  ctx.fillStyle = colors.accent;
  ctx.beginPath();
  ctx.arc(headX + 0.1 * u, headY + 0.95 * u, 0.4 * u, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = colors.dim;
  line(u * 0.3);
  for (const side of [-1, 1] as const) {
    ctx.beginPath();
    ctx.moveTo(headX + side * 0.9 * u, headY + 1.05 * u);
    ctx.lineTo(headX + side * 3.1 * u, headY + (side > 0 ? 0.55 : 1.5) * u);
    ctx.stroke();
  }

  ctx.restore();

  // Zzz, drawn upright so it never mirrors with the cat.
  if (cat.state === "sleep") {
    ctx.save();
    ctx.translate(Math.round(cat.x), Math.round(groundY));
    ctx.fillStyle = colors.dim;
    ctx.font = `500 ${Math.round(u * 3.2)}px ui-monospace, monospace`;
    const t = (Date.now() / 900) % 3;
    for (let i = 0; i < 3; i += 1) {
      const life = (t - i + 3) % 3;
      ctx.globalAlpha = Math.max(0, 0.55 - life * 0.18);
      ctx.fillText(
        "z",
        cat.facing * (4.4 * u) + life * 2.2 * u,
        -11 * u - life * 3.4 * u,
      );
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}
