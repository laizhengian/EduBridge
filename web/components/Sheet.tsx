"use client";

import { useEffect } from "react";
import {
  AnimatePresence,
  motion,
  useDragControls,
  useReducedMotion,
} from "motion/react";
import { CloseIcon } from "./ui";
import { haptic } from "@/lib/haptics";

/**
 * A bottom sheet the way iOS presents one: springs up from the bottom edge,
 * dims the page behind, and closes on tap-outside, Escape, or a downward
 * drag on its grabber — with real velocity, so a fling dismisses even a
 * short drag, and a short pull springs back. Built on the motion library
 * (gesture physics + exit animations) instead of hand-tracked touches.
 * Content scrolls inside the panel; the page behind is locked; the bottom
 * edge respects the safe area.
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
  const dragControls = useDragControls();
  const reduce = useReducedMotion();

  // page scroll lock + Escape while open
  useEffect(() => {
    if (!open) return;
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
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            className="absolute inset-0 bg-foreground/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.22 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 mx-auto max-w-2xl"
            initial={reduce ? { opacity: 0 } : { y: "100%" }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: "100%" }}
            transition={
              reduce
                ? { duration: 0 }
                : { type: "spring", stiffness: 500, damping: 46 }
            }
            drag={reduce ? false : "y"}
            dragListener={false} // only the grabber strip starts drags, so content still scrolls
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.45 }} // rubber-band, like a native sheet
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 500) {
                haptic("light");
                onClose();
              }
            }}
          >
            <div className="overflow-hidden rounded-t-2xl border-t border-hairline bg-paper shadow-[0_-8px_40px_rgba(33,29,25,0.18)]">
              {/* the drag strip — a downward pull moves the sheet itself */}
              <div
                className="touch-none select-none px-5 pb-1 pt-2.5"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div
                  className="mx-auto h-1.5 w-10 rounded-full bg-stone-300"
                  aria-hidden
                />
                <div className="flex items-center justify-between pt-2.5">
                  <h2 className="font-display text-[17px] font-semibold">
                    {title}
                  </h2>
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
