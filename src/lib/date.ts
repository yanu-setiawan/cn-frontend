import { parseDate as parseCalendarDate, type CalendarDate } from "@internationalized/date";

/**
 * Format objek Date jadi string "YYYY-MM-DD" (format ISO date polos,
 * dipakai untuk query param startDate/endDate ke backend).
 */
export function toISODateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Rentang tanggal default: 3 bulan terakhir dari hari ini.
 * Sesuai AC: "selectable period dibatasi 3 bulan terakhir".
 */
export function getDefaultDateRange(): { start: string; end: string } {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 3);

  return {
    start: toISODateString(start),
    end: toISODateString(end),
  };
}

/**
 * Wrapper parseDate dari @internationalized/date (dipakai HeroUI DateRangePicker).
 * Terima string "YYYY-MM-DD", kembalikan CalendarDate untuk value picker.
 */
export function parseDate(dateString: string): CalendarDate {
  return parseCalendarDate(dateString);
}

/**
 * Format ISO timestamp dari backend (misal "2026-08-13T06:22:00Z")
 * jadi string tanggal+jam yang enak dibaca di tabel.
 */
export function formatCallTimestamp(isoString: string): string {
  return new Date(isoString).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
