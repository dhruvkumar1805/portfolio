"use client";

import { useEffect, useRef, type ReactNode, type PointerEvent } from "react";

export default function HorizontalScroll({
  children,
  className,
  scrollToSelector,
}: {
  children: ReactNode;
  className?: string;
  scrollToSelector?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startScrollLeft: number } | null>(
    null
  );

  useEffect(() => {
    if (!scrollToSelector) return;
    const el = ref.current;
    if (!el) return;
    const target = el.querySelector<HTMLElement>(scrollToSelector);
    el.scrollLeft = target
      ? target.offsetLeft - el.clientWidth + target.offsetWidth + 16
      : el.scrollWidth;
  }, [scrollToSelector]);

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    dragRef.current = { startX: e.clientX, startScrollLeft: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    const drag = dragRef.current;
    if (!el || !drag) return;
    el.scrollLeft = drag.startScrollLeft - (e.clientX - drag.startX);
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  return (
    <div
      ref={ref}
      className={className}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      style={{ cursor: "grab", touchAction: "pan-y" }}
    >
      {children}
    </div>
  );
}
