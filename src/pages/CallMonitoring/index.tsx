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
  useDisclosure,
} from "@heroui/react";
import { createColumnHelper, type Row } from "@tanstack/react-table";
import { RiResetLeftFill } from "react-icons/ri";
import { FiSearch, FiFilter, FiChevronDown } from "react-icons/fi";
// import { FaPlus } from "react-icons/fa6";

import type { ICallMonitoringItem } from "@/interface/response/callMonitoring.interface";
import type {
  FilterState,
  ICallMonitoringCreateReq,
  ICallMonitoringFilterReq,
  ICallMonitoringUpdateReq,
} from "@/interface/request/callMonitoring.interface";
import {
  useCreateCallMonitoring,
  useEditCallMonitoring,
  useGetListCallMonitoring,
} from "@/services/CallMonitoring";
import { formatCallTimestamp, formatDateTime } from "@/lib/date";
import CustomTable from "@/components/Table";
import { SENTIMENT_OPTIONS, SORT_BY_OPTIONS, STATUS_OPTIONS } from "@/constant/callMonitoring";
import { Clock, InfoIcon } from "lucide-react";
import ModalDetailCallMonitoring from "@/components/Modal/ModalDetailCallMonitoring";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa6";
import ModalCreateCallMonitoring from "@/components/Modal/ModalCreateCallMonitoring";
import SummaryCards from "@/components/Card/SummaryCard";

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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [date, setDate] = useState<RangeValue<DateValue> | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const {
    isOpen: isDetailOpen,
    onOpen: onOpenDetail,
    onOpenChange: onOpenChangeDetail,
  } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<ICallMonitoringItem | null>(null);

  const handleOpenDetail = (item: ICallMonitoringItem) => {
    setSelectedItem(item);
    onOpenDetail();
  };

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

  const queryClient = useQueryClient();

  const { data, isLoading } = useGetListCallMonitoring(requestFilters);

  const { mutate: updateCallMonitoring, isPending: isUpdating } = useEditCallMonitoring();
  const {
    isOpen: isCreateOpen,
    onOpen: onOpenCreate,
    onOpenChange: onOpenChangeCreate,
  } = useDisclosure();
  const { mutate: createCallMonitoringMutate, isPending: isCreating } = useCreateCallMonitoring();

  const handleSubmitCreate = (payload: ICallMonitoringCreateReq) => {
    createCallMonitoringMutate(payload, {
      onSuccess: () => {
        toast.success("Data berhasil dibuat");
        queryClient.invalidateQueries({ queryKey: ["getListCallMonitoring"] });
        onOpenChangeCreate();
      },
      onError: () => {
        toast.error("Gagal membuat data");
      },
    });
  };

  const handleSubmitEdit = (id: string, payload: ICallMonitoringUpdateReq) => {
    updateCallMonitoring(
      { id, body: payload },
      {
        onSuccess: () => {
          toast.success("Data berhasil diperbarui");
          queryClient.invalidateQueries({ queryKey: ["getListCallMonitoring"] });
          onOpenChangeDetail();
        },
        onError: () => {
          toast.error("Gagal memperbarui data");
        },
      },
    );
  };

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
              className="bg-red-800/5 text-primary"
              onPress={() => handleOpenDetail(row.original)}
            >
              <InfoIcon size={17} />
            </Button>
          </div>
        ),
      },
    ],
    [filters.pageIndex, filters.pageSize],
  );

  return (
    <section className="flex flex-col gap-5 bg-[#fcfbfb] rounded-xl p-6 lg:p-16">
      <ModalDetailCallMonitoring
        isOpen={isDetailOpen}
        onOpenChange={onOpenChangeDetail}
        data={selectedItem}
        isSubmitting={isUpdating}
        onSubmitEdit={handleSubmitEdit}
      />
      <ModalCreateCallMonitoring
        isOpen={isCreateOpen}
        onOpenChange={onOpenChangeCreate}
        onSubmitCreate={handleSubmitCreate}
        isSubmitting={isCreating}
      />

      <div className="flex flex-col pt-2 pb-4  ">
        <div className="flex flex-col gap-4 pt-2 pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-[13px] text-gray-600 mt-1 flex items-center gap-1">
              <Clock size={13} /> {formatDateTime(currentTime)}
            </p>
            <h1 className="text-2xl font-semibold text-primary">
              Hai, Selamat Datang di Call Monitoring
            </h1>
          </div>
        </div>
      </div>
      <div className="relative p-6 bg-white shadow rounded-xl">
        <div className="flex flex-col gap-6 mb-6">
          <div className="flex items-center justify-between gap-4">
            <SummaryCards totalData={pagination?.totalData ?? 0} isLoading={isLoading} />
            <div className="flex items-center gap-2">
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
                onPress={onOpenCreate}
              >
                Tambah
              </Button>
            </div>
          </div>

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
              aria-label="Cari"
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
              aria-label="Tanggal"
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
              aria-label="Sentimen"
              disallowEmptySelection
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
              aria-label="Status"
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
              aria-label="Urutkan Berdasarkan"
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
              aria-label="Arah Urutan"
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
