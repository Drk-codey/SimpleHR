/** Calendar helpers for birthdays, anniversaries, and hire windows. */

export function monthDay(isoDate: string): string {
  return isoDate.slice(5, 10);
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Days until the next occurrence of an MM-DD (0 = today). */
export function daysUntilNextMonthDay(md: string, from = new Date()): number {
  const [month, day] = md.split("-").map(Number);
  const today = startOfDay(from);
  let next = new Date(today.getFullYear(), month - 1, day);
  if (next < today) {
    next = new Date(today.getFullYear() + 1, month - 1, day);
  }
  return Math.round((next.getTime() - today.getTime()) / 86_400_000);
}

export function isWithinUpcomingDays(isoDate: string, days: number, from = new Date()): boolean {
  if (!isoDate) return false;
  const n = daysUntilNextMonthDay(monthDay(isoDate), from);
  return n >= 0 && n <= days;
}

export function yearsElapsed(isoDate: string, from = new Date()): number {
  const start = new Date(isoDate);
  let years = from.getFullYear() - start.getFullYear();
  const anniversaryThisYear = new Date(from.getFullYear(), start.getMonth(), start.getDate());
  if (from < anniversaryThisYear) years -= 1;
  return Math.max(0, years);
}

export function isWithinPastDays(isoDate: string, days: number, from = new Date()): boolean {
  const then = startOfDay(new Date(isoDate));
  const today = startOfDay(from);
  const diff = Math.round((today.getTime() - then.getTime()) / 86_400_000);
  return diff >= 0 && diff <= days;
}
