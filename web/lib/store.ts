// Local homework store. Today it persists on this device so ticks survive a
// refresh; when Supabase arrives, these same four functions become database
// calls and every screen keeps working unchanged.
import { homeworkSeed, type Homework } from "@/lib/mock-data";

const KEY = "ois-homework-v1";

type Listener = () => void;
const listeners = new Set<Listener>();

function read(): Homework[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return homeworkSeed;
    return JSON.parse(raw) as Homework[];
  } catch {
    return homeworkSeed;
  }
}

function write(items: Homework[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach((l) => l());
}

export function getHomework(): Homework[] {
  return read().sort((a, b) => +new Date(a.dueAt) - +new Date(b.dueAt));
}

/** Teacher app writes here too — one store, every surface. The new item
    appears in the family homework board immediately. */
export function addHomework(item: Homework) {
  write([item, ...read()]);
}

export function toggleDone(id: string): Homework | null {
  const items = read();
  const target = items.find((h) => h.id === id);
  if (!target) return null;
  write(items.map((h) => (h.id === id ? { ...h, done: !h.done } : h)));
  return { ...target, done: !target.done };
}

export function subscribe(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}
