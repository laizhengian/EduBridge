"use client";

import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "./ui";
import { haptic } from "@/lib/haptics";

/**
 * A bottom sheet the way iOS presents one: springs up from the bottom edge,
 * dims the page behind, and closes on tap-outside, Escape, or a downward
 * drag on its grabber (with fling-to-dismiss). Content scrolls inside the
 * panel; the page behind is locked. Safe-area aware at the bottom edge.
 */
export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false); // stays mounted through the exit animation
  const [entered, setEntered] = useState(false); // entry animation finished → drags take over
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{
    startY: number;
    y: number;
    prevY: number;
    prevT: number;
    t: number;
  } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closing = !open && mounted;

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  // unmount after the exit animation has played
  useEffect(() => {
    if (open || !mounted) return;
    const t = window.setTimeout(() => {
      setMounted(false);
      setEntered(false);
      setDragY(0);
    }, 300);
    return () => window.clearTimeout(t);
  }, [open, mounted]);

  // page scroll lock + Escape while open
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  function onPanelAnimated() {
    if (!closing) setEntered(true);
  }

  function touchStart(e: React.TouchEvent) {
    if (!entered) return;
    const t = e.touches[0];
    drag.current = {
      startY: t.clientY,
      y: t.clientY,
      prevY: t.clientY,
      prevT: performance.now(),
      t: performance.now(),
    };
    setDragging(true);
  }

  function touchMove(e: React.TouchEvent) {
    if (!drag.current || !entered) return;
    const t = e.touches[0];
    const dy = t.clientY - drag.current.startY;
    drag.current.prevY = drag.current.y;
    drag.current.prevT = drag.current.t;
    drag.current.y = t.clientY;
    drag.current.t = performance.now();
    if (dy > 0) setDragY(dy * 0.92); // a hint of resistance, like a well-behaved rubber band
  }

  function touchEnd() {
    if (!drag.current || !entered) {
      drag.current = null;
      setDragging(false);
      return;
    }
    const { startY, y, prevY, prevT, t } = drag.current;
    drag.current = null;
    setDragging(false);
    const dy = y - startY;
    const vy = (y - prevY) / Math.max(t - prevT, 1); // px/ms of the last movement
    if (dy > 110 || (dy > 24 && vy > 0.5)) {
      haptic("light");
      onClose();
    } else {
      setDragY(0); // springs back
    }
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
      <div
        className={`sheet-backdrop absolute inset-0 bg-foreground/40${closing ? " closing" : ""}`}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        onAnimationEnd={onPanelAnimated}
        className={`absolute inset-x-0 bottom-0 mx-auto max-w-2xl outline-none ${
          entered && !closing ? "" : `sheet-panel${closing ? " closing" : ""}`
        }`}
        style={
          entered && !closing
            ? {
                transform: `translateY(${dragY}px)`,
                transition: dragging ? "none" : "transform 0.32s var(--spring)",
              }
            : undefined
        }
      >
        <div className="overflow-hidden rounded-t-2xl border-t border-hairline bg-paper shadow-[0_-8px_40px_rgba(33,29,25,0.18)]">
          {/* the drag strip — vertical touches here move the sheet, not the page */}
          <div
            className="touch-none select-none px-5 pb-1 pt-2.5"
            onTouchStart={touchStart}
            onTouchMove={touchMove}
            onTouchEnd={touchEnd}
            onTouchCancel={touchEnd}
          >
            <div className="mx-auto h-1.5 w-10 rounded-full bg-stone-300" aria-hidden />
            <div className="flex items-center justify-between pt-2.5">
              <h2 className="font-display text-[17px] font-semibold">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="pressable flex h-11 w-11 items-center justify-center rounded-full text-muted hover:bg-background"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="max-h-[72dvh] overflow-y-auto overscroll-contain px-5 pb-[max(env(safe-area-inset-bottom),20px)] pt-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
