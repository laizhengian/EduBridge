"use client";

import { useEffect, useRef, useState } from "react";
import { haptic } from "@/lib/haptics";

export type ToastState = { message: string; undo?: () => void } | null;

/**
 * One-line confirmation after an action, with optional Undo.
 * Springs in, auto-dismisses, never blocks the list — and swipes away
 * horizontally like a system notification, with a little fling.
 */
export function Toast({
  toast,
  onDone,
}: {
  toast: ToastState;
  onDone: () => void;
}) {
  const [shown, setShown] = useState<ToastState>(null); // kept through the exit
  const [leaving, setLeaving] = useState(false);
  const [dx, setDx] = useState(0); // live drag offset
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{
    startX: number;
    x: number;
    prevX: number;
    prevT: number;
    t: number;
  } | null>(null);

  // a new toast: show it and start the auto-dismiss clock
  useEffect(() => {
    if (!toast) return;
    setShown(toast);
    setLeaving(false);
    setDx(0);
  }, [toast]);

  // auto-dismiss (paused while a finger holds the toast)
  useEffect(() => {
    if (!toast || dragging) return;
    const t = window.setTimeout(() => setLeaving(true), 4000);
    return () => window.clearTimeout(t);
  }, [toast, dragging]);

  // finish the exit, then let the parent unmount us
  useEffect(() => {
    if (!leaving) return;
    const t = window.setTimeout(() => {
      setShown(null);
      setLeaving(false);
      setDx(0);
      onDone();
    }, 220);
    return () => window.clearTimeout(t);
  }, [leaving, onDone]);

  if (!shown) return null;

  function touchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    drag.current = {
      startX: t.clientX,
      x: t.clientX,
      prevX: t.clientX,
      prevT: performance.now(),
      t: performance.now(),
    };
    setDragging(true);
  }

  function touchMove(e: React.TouchEvent) {
    if (!drag.current) return;
    const t = e.touches[0];
    drag.current.prevX = drag.current.x;
    drag.current.prevT = drag.current.t;
    drag.current.x = t.clientX;
    drag.current.t = performance.now();
    setDx(t.clientX - drag.current.startX);
  }

  function touchEnd() {
    if (!drag.current) return;
    const { x, startX, prevX, prevT, t } = drag.current;
    drag.current = null;
    setDragging(false);
    const dist = x - startX;
    const vx = (x - prevX) / Math.max(t - prevT, 1); // px/ms of the last movement
    if (Math.abs(dist) > 80 || Math.abs(vx) > 0.5) {
      haptic("light");
      setDx(dist + Math.sign(dist || vx) * 260); // fling it out the way it was going
      setLeaving(true);
    } else {
      setDx(0); // springs back
    }
  }

  const exit = leaving && !dragging;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 md:bottom-8">
      <div
        role="status"
        aria-live="polite"
        onTouchStart={touchStart}
        onTouchMove={touchMove}
        onTouchEnd={touchEnd}
        onTouchCancel={touchEnd}
        style={
          dx !== 0
            ? {
                transform: `translateX(${dx}px)`,
                opacity: Math.max(1 - Math.abs(dx) / 320, 0),
                transition: dragging
                  ? "none"
                  : "transform 0.24s var(--spring), opacity 0.2s ease",
              }
            : undefined
        }
        className={`toast-pop pointer-events-auto flex touch-none items-center gap-4 rounded-xl bg-foreground/90 px-4 py-2.5 shadow-lg backdrop-blur-xl ${
          exit && dx === 0 ? "toast-out" : ""
        }`}
      >
        <span className="text-sm font-medium text-paper">{shown.message}</span>
        {shown.undo && (
          <button
            type="button"
            onClick={() => {
              haptic("medium");
              shown.undo?.();
              onDone();
            }}
            className="min-h-[36px] text-sm font-semibold text-[#8fd0b4]"
          >
            Undo
          </button>
        )}
      </div>
    </div>
  );
}
