import { useMemo, useState, useEffect, useCallback } from "react";
import {
  Button,
  DateRangePicker,
  Input,
  Select,
  SelectItem,
  type DateValue,
  type RangeValue,
} from "@heroui/react";
import { createColumnHelper, type Row } from "@tanstack/react-table";
import { RiResetLeftFill } from "react-icons/ri";
import { FiArrowRightCircle, FiSearch } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";

import type { ICallMonitoringItem } from "@/interface/response/callMonitoring.interface";
import type { ICallMonitoringFilterReq } from "@/interface/request/callMonitoring.interface";
import { useGetListCallMonitoring } from "@/services/CallMonitoring";
import { formatCallTimestamp } from "@/lib/date";
import CustomTable from "@/components/Table";

const columnHelper = createColumnHelper<ICallMonitoringItem>();

const SENTIMENT_OPTIONS = [
  { key: "ALL", label: "Semua Sentimen" },
  { key: "GTE_70", label: "≥ 70 (Positif)" },
  { key: "BELOW_70", label: "< 70 (Negatif)" },
];

const STATUS_OPTIONS = [
  { key: "ALL", label: "Semua Status" },
  { key: "PROSPEK", label: "Prospek" },
  { key: "CLOSE", label: "Close" },
  { key: "REJECT", label: "Reject" },
];

const SORT_BY_OPTIONS = [
  { key: "callTimestamp", label: "Tanggal Panggilan" },
  { key: "csName", label: "Nama CS" },
  { key: "customerName", label: "Nama Nasabah" },
  { key: "sentimentScore", label: "Skor Sentimen" },
  { key: "callId", label: "ID Panggilan" },
];

interface FilterState {
  search: string;
  pageIndex: number;
  pageSize: number;
  startDate: string;
  endDate: string;
  sentiment: "BELOW_70" | "GTE_70" | "ALL";
  status: "PROSPEK" | "CLOSE" | "REJECT" | "ALL";
  sortBy: "callId" | "callTimestamp" | "csName" | "customerName" | "sentimentScore";
  sortDir: "asc" | "desc";
}

export default function CallMonitoring() {
  //   const defaultDates = useMemo(() => getDefaultDateRange(), []);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    pageIndex: 1,
    pageSize: 10,
    startDate: "", // Start with empty string
    endDate: "", // Start with empty string
    sentiment: "ALL",
    status: "ALL",
    sortBy: "callTimestamp",
    sortDir: "desc",
  });

  const [searchInput, setSearchInput] = useState("");

  // Initialize with null (empty)
  const [date, setDate] = useState<RangeValue<DateValue> | null>(null);

  const handleDateChange = (newDate: RangeValue<DateValue> | null) => {
    setDate(newDate);

    if (newDate?.start && newDate?.end) {
      setFilters((prev) => ({
        ...prev,
        startDate: newDate.start.toString(),
        endDate: newDate.end.toString(),
        pageIndex: 1,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        startDate: "",
        endDate: "",
        pageIndex: 1,
      }));
    }
  };

  const requestFilters: ICallMonitoringFilterReq = {
    search: filters.search || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    sentiment: filters.sentiment !== "ALL" ? filters.sentiment : undefined,
    status: filters.status !== "ALL" ? filters.status : undefined,
    sortBy: filters.sortBy,
    sortDir: filters.sortDir,
    page: filters.pageIndex,
    size: filters.pageSize,
  };

  const { data, isLoading } = useGetListCallMonitoring(requestFilters);

  const callMonitoringData = useMemo(() => data?.data?.items ?? [], [data]);
  const pagination = data?.data?.pagination;

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value, pageIndex: 1 }));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilter("search", searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, updateFilter]);

  const handleResetFilters = () => {
    setSearchInput("");
    setFilters({
      search: "",
      pageIndex: 1,
      pageSize: 10,
      startDate: "",
      endDate: "",
      sentiment: "ALL",
      status: "ALL",
      sortBy: "callTimestamp",
      sortDir: "desc",
    });
    setDate(null); // Reset to null (empty)
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
        id: "callId",
        header: "Call ID",
        cell: (info) => info.getValue() ?? "-",
      }),
      columnHelper.accessor("callTimestamp", {
        id: "callTimestamp",
        header: "Tanggal Panggilan",
        cell: (info) => formatCallTimestamp(info.getValue()),
      }),
      columnHelper.accessor("csName", {
        id: "csName",
        header: "CS Name",
        cell: (info) => info.getValue() ?? "-",
      }),
      columnHelper.accessor("name", {
        id: "customerName",
        header: "Nama Nasabah",
        cell: (info) => info.getValue() ?? "-",
      }),
      columnHelper.accessor("phoneNumber", {
        id: "phoneNumber",
        header: "Nomor Telepon",
        cell: (info) => info.getValue() ?? "-",
      }),
      columnHelper.accessor("sentimentScore", {
        id: "sentimentScore",
        header: "Skor Sentimen",
        cell: (info) => {
          const value = info.getValue();
          if (value === undefined || value === null) return "-";
          const color = value >= 70 ? "text-success" : "text-danger";
          return <span className={`font-semibold ${color}`}>{value}</span>;
        },
      }),
      columnHelper.accessor("status", {
        id: "status",
        header: "Status",
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
    <section className="flex flex-col gap-5 bg-[#fcfbfb] rounded-xl p-6 lg:p-16">
      <div className="relative p-6 bg-white shadow rounded-xl">
        <div className="flex flex-col gap-6 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="w-1/4">
              <p className="text-lg font-medium">Call Monitoring</p>
            </div>
            <Button
              color="primary"
              variant="solid"
              className="flex items-center px-4"
              radius="md"
              startContent={<FaPlus size={14} />}
            >
              Tambah
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4 border-2 border-gray-500/20 rounded-xl p-3.5">
            <div className="flex items-center gap-3 w-full">
              <div className="flex gap-4 flex-1 flex-wrap xl:flex-nowrap">
                <Input
                  variant="bordered"
                  isClearable
                  label="Cari"
                  labelPlacement="outside"
                  placeholder="Cari disini"
                  startContent={<FiSearch />}
                  value={searchInput}
                  onValueChange={setSearchInput}
                  className="min-w-50 flex-1"
                />

                <DateRangePicker
                  variant="bordered"
                  radius="sm"
                  label="Tanggal"
                  labelPlacement="outside"
                  visibleMonths={2}
                  value={date as any} // Type assertion to bypass type conflict
                  onChange={handleDateChange}
                  classNames={{
                    label: "text-xs font-semibold",
                    segment: "data-[editable=true]:data-[placeholder=true]:text-xs",
                  }}
                  className="min-w-62.5"
                />

                <Select
                  variant="bordered"
                  radius="sm"
                  label="Sentimen"
                  labelPlacement="outside"
                  placeholder="Pilih sentimen"
                  selectedKeys={[filters.sentiment]}
                  onChange={(e) =>
                    updateFilter("sentiment", e.target.value as FilterState["sentiment"])
                  }
                  className="min-w-37.5"
                >
                  {SENTIMENT_OPTIONS.map((option) => (
                    <SelectItem key={option.key}>{option.label}</SelectItem>
                  ))}
                </Select>

                <Select
                  variant="bordered"
                  radius="sm"
                  label="Status"
                  labelPlacement="outside"
                  placeholder="Pilih status"
                  selectedKeys={[filters.status]}
                  onChange={(e) => updateFilter("status", e.target.value as FilterState["status"])}
                  className="min-w-37.5"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.key}>{option.label}</SelectItem>
                  ))}
                </Select>

                <Select
                  variant="bordered"
                  radius="sm"
                  label="Urutkan Berdasarkan"
                  labelPlacement="outside"
                  placeholder="Pilih kolom"
                  selectedKeys={[filters.sortBy]}
                  onChange={(e) => updateFilter("sortBy", e.target.value as FilterState["sortBy"])}
                  className="min-w-45"
                >
                  {SORT_BY_OPTIONS.map((option) => (
                    <SelectItem key={option.key}>{option.label}</SelectItem>
                  ))}
                </Select>

                <Select
                  variant="bordered"
                  radius="sm"
                  label="Arah Urutan"
                  labelPlacement="outside"
                  placeholder="Pilih arah"
                  selectedKeys={[filters.sortDir]}
                  onChange={(e) =>
                    updateFilter("sortDir", e.target.value as FilterState["sortDir"])
                  }
                  className="min-w-32.5"
                >
                  <SelectItem key="asc">Ascending</SelectItem>
                  <SelectItem key="desc">Descending</SelectItem>
                </Select>

                <div className="flex items-end gap-2">
                  <Button
                    isIconOnly
                    variant="flat"
                    aria-label="Reset Filters"
                    onPress={handleResetFilters}
                    className="bg-red-50 h-14"
                  >
                    <RiResetLeftFill size={20} className="text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CustomTable
          columns={dataColumns}
          data={callMonitoringData}
          isLoading={isLoading}
          pageSize={filters.pageSize}
          currentPage={pagination?.currentPage ?? filters.pageIndex}
          totalData={pagination?.totalData ?? 0}
          pageCount={pagination?.totalPages ?? 0}
          handlePageChange={(page: number) => setFilters((prev) => ({ ...prev, pageIndex: page }))}
        />
      </div>
    </section>
  );
}
