// The Study Center's shared store. Same architecture as homework: the family
// app reads what the teacher app writes, from one list — proving the one-vault
// pattern before the database exists. When Supabase lands, these three
// functions become database queries and no screen changes.
import { studySeed, type StudyResource } from "@/lib/mock-data";

const KEY = "ois-study-v1";

type Listener = () => void;
const listeners = new Set<Listener>();

function read(): StudyResource[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return studySeed;
    const parsed = JSON.parse(raw) as StudyResource[];
    return Array.isArray(parsed) ? parsed : studySeed;
  } catch {
    return studySeed;
  }
}

function write(items: StudyResource[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach((l) => l());
}

export function getStudy(): StudyResource[] {
  return read().sort((a, b) => +new Date(b.sharedAt) - +new Date(a.sharedAt));
}

/** Teacher app writes here; the family Study Center picks it up at once. */
export function addStudy(item: StudyResource) {
  write([item, ...read()]);
}

/** Used only by tests / demo resets. */
export function resetStudy() {
  window.localStorage.removeItem(KEY);
}

export function subscribe(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}
