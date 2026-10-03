// Local school-events store — the admin console manages the calendar here;
// the family app's Events, Today and Holidays screens read from it. When
// Supabase arrives these functions become database calls.
import { events, type SchoolEvent } from "@/lib/mock-data";

const KEY = "ois-events-v1";

type Listener = () => void;
const listeners = new Set<Listener>();

function read(): SchoolEvent[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return events;
    return JSON.parse(raw) as SchoolEvent[];
  } catch {
    return events;
  }
}

function write(items: SchoolEvent[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach((l) => l());
}

export function getEvents(): SchoolEvent[] {
  return read().sort((a, b) => +new Date(a.date) - +new Date(b.date));
}

/** Admin console adds calendar entries — one store, every surface. */
export function addEvent(item: SchoolEvent) {
  write([...read(), item]);
}

export function removeEvent(id: string) {
  write(read().filter((e) => e.id !== id));
}

export function subscribe(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}
