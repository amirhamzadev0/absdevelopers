const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** "2026-09-25" → "25 September 2026" (UTC, so server and client agree). */
export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(`${isoDate.slice(0, 10)}T00:00:00Z`));
}

/** 1 → "01" */
export function padIndex(index: number): string {
  return String(index).padStart(2, "0");
}
