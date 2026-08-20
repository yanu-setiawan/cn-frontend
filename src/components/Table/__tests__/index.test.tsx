import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { HeroUIProvider } from "@heroui/react";
import type { TableOptions } from "@tanstack/react-table";

import CustomTable from "@/components/Table";

interface Row {
  name: string;
  score: number;
}

const columns: TableOptions<Row>["columns"] = [
  { id: "name", header: "Nama", accessorKey: "name" },
  { id: "score", header: "Skor", accessorKey: "score" },
];

const rows: Row[] = [
  { name: "Budi", score: 82 },
  { name: "Siti", score: 64 },
];

type Props = Parameters<typeof CustomTable<Row>>[0];

const renderTable = (overrides: Partial<Props> = {}) => {
  const handlePageChange = vi.fn();

  const utils = render(
    <HeroUIProvider>
      <CustomTable<Row>
        columns={columns}
        data={rows}
        pageSize={10}
        currentPage={1}
        isLoading={false}
        totalData={rows.length}
        pageCount={1}
        handlePageChange={handlePageChange}
        {...overrides}
      />
    </HeroUIProvider>,
  );

  return { ...utils, handlePageChange };
};

describe("<CustomTable />", () => {
  it("render tanpa crash dan menampilkan header kolom", () => {
    renderTable();

    // Pakai getByText, bukan getByRole('columnheader') — lebih stabil,
    // tidak bergantung pada komputasi ARIA role otomatis untuk <th> tanpa scope.
    expect(screen.getByText("Nama")).toBeInTheDocument();
    expect(screen.getByText("Skor")).toBeInTheDocument();
  });

  it("menampilkan seluruh baris data", () => {
    renderTable();

    expect(screen.getByText("Budi")).toBeInTheDocument();
    expect(screen.getByText("82")).toBeInTheDocument();
    expect(screen.getByText("Siti")).toBeInTheDocument();
    expect(screen.getByText("64")).toBeInTheDocument();
  });

  it("menampilkan skeleton saat isLoading true dan menyembunyikan data", () => {
    renderTable({ isLoading: true });

    expect(screen.getByText("Sedang Memuat Data...")).toBeInTheDocument();
    expect(screen.queryByText("Budi")).not.toBeInTheDocument();
  });

  it("edge case: menampilkan empty state saat data kosong", () => {
    renderTable({ data: [], totalData: 0, pageCount: 0 });

    expect(screen.getByText("Ups, Tidak Ada Data")).toBeInTheDocument();
    expect(
      screen.getByText("Belum ada informasi yang bisa ditampilkan saat ini."),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Menampilkan/)).not.toBeInTheDocument();
  });

  it("menghitung rentang item yang sedang ditampilkan di halaman kedua", () => {
    renderTable({ currentPage: 2, pageSize: 10, totalData: 12, pageCount: 2, data: rows });

    const summary = screen
      .getByText(/Menampilkan/)
      .textContent?.replace(/\s+/g, " ")
      .trim();
    expect(summary).toBe("Menampilkan 11-12 dari 12 Item");
  });

  it("menyembunyikan pagination saat prop hidePagination true", () => {
    renderTable({ hidePagination: true });

    expect(screen.queryByText(/Menampilkan/)).not.toBeInTheDocument();
  });

  it("edge case: reset ke halaman 1 kalau currentPage melebihi jumlah halaman", async () => {
    const { handlePageChange } = renderTable({ currentPage: 5, pageCount: 2, totalData: 12 });

    await waitFor(() => expect(handlePageChange).toHaveBeenCalledWith(1));
  });
});
