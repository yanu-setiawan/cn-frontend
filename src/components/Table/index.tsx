import { useEffect, useState } from "react";
import { Pagination, Button } from "@heroui/react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { TableOptions } from "@tanstack/react-table";
import { FaFaceFrownOpen } from "react-icons/fa6";
import { FaSpinner } from "react-icons/fa";

const TableSkeleton = ({ colSpan }: { colSpan: number }) => (
  <tr>
    <td colSpan={colSpan} className="px-6 py-20 text-center bg-gray-100 animate-pulse">
      <div className="flex flex-col items-center justify-center gap-4 text-gray-500">
        <FaSpinner size={48} className="text-primary animate-spin" />
        <p className="text-xl font-bold text-gray-700">Sedang Memuat Data...</p>
        <p className="text-base text-gray-500">Mohon tunggu sebentar, data sedang diproses.</p>
      </div>
    </td>
  </tr>
);

interface Props<T> {
  data: T[];
  columns: TableOptions<T>["columns"];
  pageSize: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
  isLoading: boolean;
  totalData: number;
  pageCount: number;
  hidePagination?: boolean;
}

const CustomTable = <T,>({
  data,
  columns,
  pageSize,
  currentPage,
  isLoading,
  totalData,
  pageCount,
  handlePageChange,
  hidePagination = false,
}: Props<T>) => {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<T>({
    data,
    columns,
    rowCount: totalData,
    pageCount: pageCount,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: { pageIndex: currentPage - 1, pageSize },
    },
    globalFilterFn: "includesString",
    manualPagination: true,
  });

  const [startIdx, setStartIdx] = useState(1);
  const [endIdx, setEndIndex] = useState(1);
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    if (pageCount > 0 && currentPage > pageCount) {
      handlePageChange(1);
    }
  }, [currentPage, pageCount, handlePageChange]);

  useEffect(() => {
    table.setPageIndex(currentPage - 1);
    table.setPageSize(pageSize);
  }, [currentPage, pageSize, table]);

  useEffect(() => {
    setStartIdx((currentPage - 1) * pageSize + 1);
    setEndIndex(Math.min(currentPage * pageSize, totalData));
  }, [currentPage, pageSize, totalData]);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsContentVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsContentVisible(false);
    }
  }, [isLoading, data]);

  return (
    <div className="overflow-hidden bg-white rounded-lg">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm border border-gray-300 rounded-xl mb-1">
          <thead className="text-black border-b-2 border-dashed border-gray-300 bg-[#F4F4F4]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 font-semibold tracking-wider text-center text-black"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            className={`divide-y-2 divide-gray-200/70 transition-opacity duration-300 ${
              isContentVisible ? "opacity-100" : "opacity-100"
            }`}
          >
            {isLoading ? (
              <TableSkeleton colSpan={columns.length} />
            ) : data.length < 1 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center gap-4 text-gray-500">
                    <FaFaceFrownOpen size={48} className="text-gray-400 animate-bounce-slow" />
                    <p className="text-xl font-bold text-gray-700">Ups, Tidak Ada Data</p>
                    <p className="text-base text-gray-500">
                      Belum ada informasi yang bisa ditampilkan saat ini.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-[#F4F4F4]/5">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 text-sm text-center text-gray-700 whitespace-nowrap"
                    >
                      <div className="flex items-center justify-center">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {!hidePagination && data.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-4 p-4 mt-1 bg-white border border-gray-200 rounded-b-lg lg:justify-between">
          <span className="text-sm text-gray-700 animate-fade-in-up">
            Menampilkan <span className="font-extrabold text-black">{startIdx}</span>-
            <span className="font-extrabold text-black">{endIdx}</span> dari{" "}
            <span className="font-extrabold text-black">{totalData}</span> Item
          </span>
          <div className="items-center hidden gap-2 lg:flex">
            <Button
              variant="flat"
              className="font-semibold text-white transition-all duration-200 transform bg-dark-primary hover:bg-primary-dark"
              size="sm"
              isDisabled={!table.getCanPreviousPage()}
              onPress={() => handlePageChange(currentPage - 1)}
            >
              Sebelumnya
            </Button>
            <Pagination
              color="primary"
              total={table.getPageCount()}
              onChange={handlePageChange}
              page={currentPage}
              classNames={{
                item: "bg-white border border-gray-300 text-gray-700 data-[hover=true]:bg-gray-100 transition-all duration-200",
                cursor:
                  "bg-dark-primary border-primary text-white shadow-md transition-all duration-200 transform hover:scale-110",
              }}
            />
            <Button
              variant="flat"
              className="font-semibold text-white transition-all duration-200 transform bg-dark-primary hover:bg-primary-dark"
              size="sm"
              isDisabled={!table.getCanNextPage()}
              onPress={() => handlePageChange(currentPage + 1)}
            >
              Selanjutnya
            </Button>
          </div>
          <div className="flex flex-col items-center gap-4 lg:hidden">
            <Pagination
              size="sm"
              color="primary"
              total={table.getPageCount()}
              onChange={handlePageChange}
              page={currentPage}
              classNames={{
                item: "bg-white border border-gray-300 text-gray-700 data-[hover=true]:bg-gray-100 transition-all duration-200",
                cursor:
                  "bg-dark-primary border-primary text-white shadow-md transition-all duration-200 transform hover:scale-110",
              }}
            />
            <div className="flex gap-4">
              <Button
                variant="flat"
                className="font-semibold text-white transition-all duration-200 transform bg-dark-primary hover:bg-primary-dark"
                isDisabled={!table.getCanPreviousPage()}
                size="sm"
                onPress={() => handlePageChange(currentPage - 1)}
              >
                Sebelumnya
              </Button>
              <Button
                variant="flat"
                className="font-semibold text-white transition-all duration-200 transform bg-dark-primary hover:bg-primary-dark"
                size="sm"
                isDisabled={!table.getCanNextPage()}
                onPress={() => handlePageChange(currentPage + 1)}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTable;
