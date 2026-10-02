import type { Speaker } from "./event-data";

export function reorderSpeakers(speakers: Speaker[], from: number, to: number): Speaker[] {
  if (from < 0 || to < 0 || from >= speakers.length || to >= speakers.length) return speakers;
  const next = [...speakers];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
