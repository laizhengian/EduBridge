// Local circulars store — the same pattern as the homework store. The admin
// console writes memos here; the family app's News and Today screens read
// from it, so a memo sent by the office appears on every family device
// immediately. When Supabase arrives these functions become database calls.
import { circulars, type Circular } from "@/lib/mock-data";

const KEY = "ois-circulars-v1";

type Listener = () => void;
const listeners = new Set<Listener>();

function read(): Circular[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return circulars;
    return JSON.parse(raw) as Circular[];
  } catch {
    return circulars;
  }
}

function write(items: Circular[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach((l) => l());
}

export function getCirculars(): Circular[] {
  return read().sort((a, b) => +new Date(b.postedAt) - +new Date(a.postedAt));
}

/** Admin console writes here — one store, every surface. */
export function addCircular(item: Circular) {
  write([item, ...read()]);
}

export function subscribe(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}
