"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { haptic } from "@/lib/haptics";

export type ToastState = { message: string; undo?: () => void } | null;

/**
 * One-line confirmation after an action, with optional Undo.
 * Springs in, auto-dismisses, never blocks the list — and swipes away
 * horizontally like a system notification, with velocity, so a fling
 * dismisses even a short drag. Built on the motion library.
 */
export function Toast({
  toast,
  onDone,
}: {
  toast: ToastState;
  onDone: () => void;
}) {
  const [shown, setShown] = useState<ToastState>(null); // kept through the exit
  const reduce = useReducedMotion();
  const flingDir = useRef(1); // which way the finger was moving when dismissed

  // a new toast: show it (and restart the auto-dismiss clock)
  useEffect(() => {
    if (toast) setShown(toast);
  }, [toast]);

  // auto-dismiss
  useEffect(() => {
    if (!shown) return;
    const t = window.setTimeout(() => setShown(null), 4000);
    return () => window.clearTimeout(t);
  }, [shown]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 md:bottom-8">
      <AnimatePresence>
        {shown && (
          <motion.div
            key={shown.message}
            role="status"
            aria-live="polite"
            drag={reduce ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.9}
            onDragEnd={(_, info) => {
              if (
                Math.abs(info.offset.x) > 80 ||
                Math.abs(info.velocity.x) > 500
              ) {
                flingDir.current = Math.sign(info.offset.x || info.velocity.x) || 1;
                haptic("light");
                setShown(null);
              }
            }}
            initial={
              reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.96 }
            }
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.1 } }
                : {
                    x: 260 * flingDir.current,
                    opacity: 0,
                    transition: { type: "spring", stiffness: 500, damping: 40 },
                  }
            }
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 480, damping: 34 }}
            className="pointer-events-auto flex touch-none items-center gap-4 rounded-xl border border-white/10 bg-[#2a2d31] px-4 py-2.5 text-white shadow-lg backdrop-blur-xl"
          >
            <span className="text-sm font-medium text-white">{shown.message}</span>
            {shown.undo && (
              <button
                type="button"
                onClick={() => {
                  haptic("medium");
                  shown.undo?.();
                  onDone();
                }}
                className="min-h-[36px] text-sm font-semibold text-[#7fc4a6]"
              >
                Undo
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
