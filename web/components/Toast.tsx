"use client";

import { useEffect } from "react";

export type ToastState = { message: string; undo?: () => void } | null;

/**
 * One-line confirmation at the bottom of the screen after an action,
 * with an optional Undo. Auto-dismisses; never blocks the list.
 */
export function Toast({
  toast,
  onDone,
}: {
  toast: ToastState;
  onDone: () => void;
}) {
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(onDone, 4000);
    return () => window.clearTimeout(t);
  }, [toast, onDone]);

  if (!toast) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 md:bottom-8">
      <div
        role="status"
        aria-live="polite"
        className="toast-pop pointer-events-auto flex items-center gap-4 rounded-xl bg-foreground px-4 py-2.5 shadow-lg"
      >
        <span className="text-sm font-medium text-paper">{toast.message}</span>
        {toast.undo && (
          <button
            type="button"
            onClick={() => {
              toast.undo?.();
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
