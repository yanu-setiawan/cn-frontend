import { useMemo, useState, useEffect, useCallback } from "react";
import {
  Button,
  DateRangePicker,
  Input,
  Select,
  SelectItem,
  Chip,
  cn,
  type DateValue,
  type RangeValue,
} from "@heroui/react";
import { createColumnHelper, type Row } from "@tanstack/react-table";
import { RiResetLeftFill } from "react-icons/ri";
import { FiArrowRightCircle, FiSearch, FiFilter, FiChevronDown } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";

import type { ICallMonitoringItem } from "@/interface/response/callMonitoring.interface";
import type {
  FilterState,
  ICallMonitoringFilterReq,
} from "@/interface/request/callMonitoring.interface";
import { useGetListCallMonitoring } from "@/services/CallMonitoring";
import { formatCallTimestamp } from "@/lib/date";
import CustomTable from "@/components/Table";
import { SENTIMENT_OPTIONS, SORT_BY_OPTIONS, STATUS_OPTIONS } from "@/constant/callMonitoring";

const columnHelper = createColumnHelper<ICallMonitoringItem>();

export default function CallMonitoring() {
  const [filters, setFilters] = useState<FilterState>({
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

  const [searchInput, setSearchInput] = useState("");
  const [date, setDate] = useState<RangeValue<DateValue> | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.startDate && filters.endDate) count++;
    if (filters.sentiment !== "ALL") count++;
    if (filters.status !== "ALL") count++;
    return count;
  }, [filters]);

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
    setDate(null);
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
            <p className="text-lg font-medium text-accent-primary">Call Monitoring</p>

            <div className="flex items-center gap-2">
              {/* Toggle filter — cuma tampil di mobile */}
              <Button
                variant="bordered"
                radius="md"
                className="lg:hidden"
                startContent={<FiFilter size={16} />}
                endContent={
                  <FiChevronDown
                    size={14}
                    className={cn("transition-transform", isFilterOpen && "rotate-180")}
                  />
                }
                onPress={() => setIsFilterOpen((prev) => !prev)}
              >
                Filter
                {activeFilterCount > 0 && (
                  <Chip size="sm" color="primary" className="ml-1">
                    {activeFilterCount}
                  </Chip>
                )}
              </Button>

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
          </div>

          {/* Panel filter — hidden/flex dikontrol isFilterOpen di mobile, SELALU flex di lg ke atas */}
          <div
            className={cn(
              "flex-col gap-4 border-2 border-gray-500/20 rounded-xl p-3.5",
              isFilterOpen ? "flex" : "hidden",
              "lg:flex lg:flex-row lg:items-end",
            )}
          >
            <Input
              variant="bordered"
              isClearable
              label="Cari"
              labelPlacement="outside"
              placeholder="Cari disini"
              startContent={<FiSearch />}
              value={searchInput}
              onValueChange={setSearchInput}
              className="w-full lg:min-w-50 lg:w-auto lg:flex-1"
            />

            <DateRangePicker
              variant="bordered"
              radius="sm"
              label="Tanggal"
              labelPlacement="outside"
              visibleMonths={2}
              value={date as any}
              onChange={handleDateChange}
              classNames={{
                label: "text-xs font-semibold",
                segment: "data-[editable=true]:data-[placeholder=true]:text-xs",
              }}
              className="w-full lg:min-w-62.5 lg:w-auto"
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
              className="w-full lg:min-w-37.5 lg:w-auto"
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
              className="w-full lg:min-w-37.5 lg:w-auto"
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
              className="w-full lg:min-w-45 lg:w-auto"
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
              onChange={(e) => updateFilter("sortDir", e.target.value as FilterState["sortDir"])}
              className="w-full lg:min-w-32.5 lg:w-auto"
            >
              <SelectItem key="asc">Ascending</SelectItem>
              <SelectItem key="desc">Descending</SelectItem>
            </Select>

            <Button
              isIconOnly
              variant="solid"
              aria-label="Reset Filters"
              onPress={handleResetFilters}
              color="primary"
              className="w-full lg:w-auto"
            >
              <RiResetLeftFill size={20} />
            </Button>
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
