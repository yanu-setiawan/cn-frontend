import { describe, it, expect, afterEach, vi } from "vitest";

import {
  toISODateString,
  getDefaultDateRange,
  parseDate,
  formatCallTimestamp,
  formatDateTime,
} from "@/lib/date";

/**
 * Catatan soal timezone:
 * - `toISODateString` memakai `toISOString()` (selalu UTC), jadi Date-nya dibuat
 *   lewat `Date.UTC(...)` supaya hasilnya sama di mesin manapun.
 * - `formatCallTimestamp` / `formatDateTime` memakai `toLocaleString` (waktu lokal),
 *   jadi Date-nya dibuat lewat constructor waktu lokal `new Date(y, m, d, h, m)`
 *   atau string ISO tanpa suffix "Z" (spec: dianggap waktu lokal).
 */

afterEach(() => {
  vi.useRealTimers();
});

describe("toISODateString", () => {
  it("mengubah Date jadi string YYYY-MM-DD", () => {
    expect(toISODateString(new Date(Date.UTC(2026, 7, 13)))).toBe("2026-08-13");
  });

  it("memberi padding nol untuk bulan dan tanggal satu digit", () => {
    expect(toISODateString(new Date(Date.UTC(2026, 0, 5)))).toBe("2026-01-05");
  });

  it("membuang bagian jam dari timestamp", () => {
    expect(toISODateString(new Date(Date.UTC(2026, 11, 31, 23, 59, 59)))).toBe("2026-12-31");
  });

  it("edge case: melempar RangeError untuk Date tidak valid", () => {
    expect(() => toISODateString(new Date("bukan-tanggal"))).toThrow(RangeError);
  });
});

describe("getDefaultDateRange", () => {
  it("mengembalikan rentang 3 bulan terakhir dari hari ini", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-21T12:00:00Z"));

    expect(getDefaultDateRange()).toEqual({
      start: "2026-05-21",
      end: "2026-08-21",
    });
  });

  it("selalu mengembalikan dua string berformat YYYY-MM-DD dengan start sebelum end", () => {
    const { start, end } = getDefaultDateRange();

    expect(start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(end).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(start < end).toBe(true);
  });

  it("edge case: tanggal akhir bulan yang tidak ada di bulan target ikut ter-rollover", () => {
    // 31 Mei dikurangi 3 bulan = 31 Februari, yang tidak ada di 2026 (Februari 28 hari),
    // sehingga Date me-rollover ke 3 Maret.
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-31T12:00:00Z"));

    expect(getDefaultDateRange()).toEqual({
      start: "2026-03-03",
      end: "2026-05-31",
    });
  });

  it("edge case: rentang yang melewati pergantian tahun tetap benar", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15T12:00:00Z"));

    expect(getDefaultDateRange()).toEqual({
      start: "2025-10-15",
      end: "2026-01-15",
    });
  });
});

describe("parseDate", () => {
  it("mengubah string YYYY-MM-DD jadi CalendarDate", () => {
    const result = parseDate("2026-08-13");

    expect(result.year).toBe(2026);
    expect(result.month).toBe(8);
    expect(result.day).toBe(13);
    expect(result.toString()).toBe("2026-08-13");
  });

  it("mendukung tanggal kabisat 29 Februari", () => {
    expect(parseDate("2024-02-29").toString()).toBe("2024-02-29");
  });

  it("edge case: melempar error untuk string kosong", () => {
    expect(() => parseDate("")).toThrow();
  });

  it("edge case: melempar error untuk format tanggal yang salah", () => {
    expect(() => parseDate("13-08-2026")).toThrow();
  });
});

describe("formatCallTimestamp", () => {
  it("memformat timestamp jadi tanggal + jam locale id-ID", () => {
    expect(formatCallTimestamp("2026-08-13T06:22:00")).toBe("13 Agu 2026, 06.22");
  });

  it("memberi padding nol pada jam dan tanggal satu digit", () => {
    expect(formatCallTimestamp("2026-01-05T00:05:00")).toBe("05 Jan 2026, 00.05");
  });

  it("memakai format 24 jam (bukan AM/PM)", () => {
    const result = formatCallTimestamp("2026-08-13T21:45:00");

    expect(result).toBe("13 Agu 2026, 21.45");
    expect(result).not.toMatch(/\d\s*[AP]M/i);
  });

  it("menerima timestamp UTC bersuffix Z dari backend", () => {
    // Nilai jamnya bergantung timezone mesin, jadi yang dicek strukturnya.
    expect(formatCallTimestamp("2026-08-13T06:22:00Z")).toMatch(
      /^\d{2} \w{3} \d{4}, \d{2}\.\d{2}$/,
    );
  });

  it("edge case: mengembalikan 'Invalid Date' untuk string kosong", () => {
    expect(formatCallTimestamp("")).toBe("Invalid Date");
  });

  it("edge case: mengembalikan 'Invalid Date' untuk string yang bukan tanggal", () => {
    expect(formatCallTimestamp("bukan-tanggal")).toBe("Invalid Date");
  });
});

describe("formatDateTime", () => {
  it("memformat Date jadi 'Hari, DD Bulan YYYY | HH.mm WIB'", () => {
    expect(formatDateTime(new Date(2026, 7, 13, 6, 22))).toBe(
      "Kamis, 13 Agustus 2026 | 06.22 WIB",
    );
  });

  it("menuliskan nama hari dan bulan dalam bahasa Indonesia", () => {
    expect(formatDateTime(new Date(2026, 0, 5, 14, 30))).toBe("Senin, 5 Januari 2026 | 14.30 WIB");
  });

  it("edge case: tengah malam diformat sebagai 00.00, bukan 12.00", () => {
    const result = formatDateTime(new Date(2026, 7, 13, 0, 0));

    expect(result).toBe("Kamis, 13 Agustus 2026 | 00.00 WIB");
    expect(result).not.toMatch(/\d\s*[AP]M/i);
  });

  it("edge case: Date tidak valid menghasilkan 'Invalid Date' pada kedua bagiannya", () => {
    expect(formatDateTime(new Date("bukan-tanggal"))).toBe("Invalid Date | Invalid Date WIB");
  });
});
