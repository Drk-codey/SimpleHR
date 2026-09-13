export function getInitials(first: string, last?: string): string {
  if (last) return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
  return first
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function displayName(first: string, last: string, preferred?: string | null): string {
  const full = `${first} ${last}`.trim();
  if (preferred && preferred !== first) return `${full} (${preferred})`;
  return full;
}
