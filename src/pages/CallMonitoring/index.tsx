import { useMemo, useState, useEffect, useCallback } from "react";
import { Button, Input } from "@heroui/react";
import { createColumnHelper, type Row } from "@tanstack/react-table";
import { RiResetLeftFill } from "react-icons/ri";
import { FiArrowRightCircle, FiSearch } from "react-icons/fi";

import type { ICallMonitoringItem } from "@/interface/response/callMonitoring.interface";
import { useGetListCallMonitoring } from "@/services/CallMonitoring";
import CustomTable from "@/components/Table";
import { FaPlus } from "react-icons/fa6";

const columnHelper = createColumnHelper<ICallMonitoringItem>();

export default function CallMonitoring() {
  const [filters, setFilters] = useState({
    search: "",
    pageIndex: 1,
    pageSize: 10,
  });
  const [id, setId] = useState("");

  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading } = useGetListCallMonitoring(
    String(filters.pageSize),
    String(filters.pageIndex),
    filters.search,
  );

  //   const handleOpenEdit = useCallback(
  //     (id: string) => {
  //       setId(id);
  //       onOpenChangeEdit();
  //     },
  //     [onOpenChangeEdit],
  //   );

  const komponenData = useMemo(() => {
    if (!data?.data?.items) {
      return [];
    }
    return data.data.items;
  }, [data]);

  const totalData = useMemo(() => {
    return data?.data?.pagination?.totalData || 0;
  }, [data]);

  const pageCount = useMemo(() => {
    if (!totalData || !filters.pageSize) return 0;
    return Math.ceil(totalData / filters.pageSize);
  }, [totalData, filters.pageSize]);

  const updateFilter = useCallback((key: keyof typeof filters, value: string) => {
    setFilters((f) => ({ ...f, [key]: value, pageIndex: 1 }));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilter("search", searchInput);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchInput, updateFilter]);

  const handleResetFilters = () => {
    setSearchInput("");
    setFilters({
      search: "",
      pageIndex: 1,
      pageSize: 10,
    });
  };

  const dataColumns = useMemo(
    () => [
      {
        id: "no",
        header: "No",
        cell: ({ row }: { row: Row<ICallMonitoringItem> }) =>
          (filters.pageIndex - 1) * filters.pageSize + row.index + 1,
        size: 50,
      },

      columnHelper.accessor("number", {
        id: "nomor",
        header: "Nomor Telepon",
        cell: (info) => info.getValue() ?? "-",
      }),

      columnHelper.accessor("callTimestamp", {
        id: "callTimestamp",
        header: "Tanggal Panggilan",
        cell: (info) => info.getValue() ?? "-",
      }),

      columnHelper.accessor("name", {
        id: "name",
        header: "Nama Nasabah",
        cell: (info) => info.getValue() ?? "-",
      }),
      columnHelper.accessor("csName", {
        id: "csName",
        header: "Nama Customer Service",
        cell: (info) => info.getValue() ?? "-",
      }),
      columnHelper.accessor("sentimentScore", {
        id: "sentimentScore",
        header: "Skor Sentimen",
        cell: (info) => info.getValue() ?? "-",
      }),

      {
        id: "action",
        header: "Aksi",
        cell: ({ row }: { row: Row<ICallMonitoringItem> }) => (
          <div className="flex justify-center gap-2">
            <Button
              radius="sm"
              size="sm"
              isIconOnly
              aria-label="Detail"
              className="bg-primary/10 text-primary"
              //   onPress={() => handleOpenEdit(row.original.id)}
            >
              <FiArrowRightCircle size={17} />
            </Button>
          </div>
        ),
      },
    ],
    [filters.pageIndex, filters.pageSize],
  );

  return (
    <section className="flex flex-col gap-5 bg-[#fcfbfb] rounded-xl p-16">
      <div className="relative p-6 bg-white shadow rounded-xl">
        <div className="flex flex-col gap-6 mb-6">
          <div className="flex flex-wrap items-center gap-4 border-2 border-gray-500/20 rounded-xl p-3.5">
            <div className="flex items-center gap-3 w-full justify-between">
              <div className="w-1/3">
                <p className="text-lg font-medium">Call Monitoring</p>
              </div>

              <div className="flex gap-4">
                <Input
                  variant="bordered"
                  isClearable
                  placeholder="Cari disini"
                  startContent={<FiSearch />}
                  value={filters.search}
                  onValueChange={(v) => updateFilter("search", v)}
                  className="grow italic sm:grow-0 w-max"
                />
                <Button
                  isIconOnly
                  variant="flat"
                  aria-label="Reset Filters"
                  onPress={handleResetFilters}
                  className="bg-red-50"
                >
                  <RiResetLeftFill size={20} className="text-red-500" />
                </Button>

                <Button
                  color="primary"
                  variant="solid"
                  //   onPress={() => onOpen()}
                  className="flex items-center px-1 min-w-32"
                  radius="sm"
                  startContent={<FaPlus size={14} className="min-w-max" />}
                >
                  Tambah
                </Button>
              </div>
            </div>
          </div>
        </div>

        <CustomTable
          columns={dataColumns}
          data={komponenData}
          isLoading={isLoading}
          pageSize={filters.pageSize}
          currentPage={filters.pageIndex}
          totalData={totalData}
          pageCount={pageCount}
          handlePageChange={(page: number) => setFilters((f) => ({ ...f, pageIndex: page }))}
        />
      </div>
    </section>
  );
}
