import { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { User, Headphones, Phone, Clock, Timer, Smile, Pencil } from "lucide-react";
import type { ICallMonitoringItem } from "@/interface/response/callMonitoring.interface";
import { formatCallTimestamp } from "@/lib/date";
import type { ICallMonitoringUpdateReq } from "@/interface/request/callMonitoring.interface";

interface ModalDetailCallMonitoringProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: ICallMonitoringItem | null;
  onSubmitEdit: (id: string, payload: ICallMonitoringUpdateReq) => void;
  isSubmitting?: boolean;
}

const STATUS_COLOR: Record<string, "default" | "success" | "danger"> = {
  PROSPEK: "default",
  CLOSE: "success",
  REJECT: "danger",
};

const STATUS_OPTIONS = [
  { key: "PROSPEK", label: "Prospek" },
  { key: "CLOSE", label: "Close" },
  { key: "REJECT", label: "Reject" },
];

const DetailField = ({
  icon,
  label,
  value,
  valueClassName,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) => (
  <div className="space-y-1">
    <span className="flex items-center text-primary gap-1.5 text-sm font-semibold uppercase  ">
      {icon}
      {label}
    </span>
    <p className={`text-sm  text-gray-800 pl-5 ${valueClassName}`}>{value}</p>
  </div>
);

const ModalDetailCallMonitoring: React.FC<ModalDetailCallMonitoringProps> = ({
  isOpen,
  onOpenChange,
  data,
  onSubmitEdit,
  isSubmitting = false,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<ICallMonitoringUpdateReq>({});

  useEffect(() => {
    if (data) {
      setFormData({
        customerName: data.name,
        phoneNumber: data.phoneNumber ?? "",
        csName: data.csName,
        sentimentScore: data.sentimentScore ?? undefined,
        durationSeconds: data.durationSeconds ?? undefined,
        status: data.status,
      });
      setIsEditMode(false);
    }
  }, [data]);

  const handleCancelEdit = () => {
    if (data) {
      setFormData({
        customerName: data.name,
        phoneNumber: data.phoneNumber ?? "",
        csName: data.csName,
        sentimentScore: data.sentimentScore ?? undefined,
        durationSeconds: data.durationSeconds ?? undefined,
        status: data.status,
      });
    }
    setIsEditMode(false);
  };

  const handleSubmit = () => {
    if (!data) return;
    onSubmitEdit(data.id, formData);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="border-b border-gray-300 px-6 py-4">
              <span className="font-bold text-xl text-gray-800">
                {isEditMode ? "Ubah Call Monitoring" : "Detail Call Monitoring"}
              </span>
            </ModalHeader>

            <ModalBody className="p-6 gap-y-6">
              {!data ? (
                <div className="flex justify-center p-10">
                  <p className="text-gray-500">Data tidak ditemukan</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between rounded-lg bg-accent-secondary p-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Call ID
                      </p>
                      <p className="text-lg font-bold text-primary">{data.number}</p>
                    </div>
                    {!isEditMode && (
                      <Chip color={STATUS_COLOR[data.status]} variant="flat" size="md">
                        {data.status}
                      </Chip>
                    )}
                  </div>

                  {!isEditMode ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <DetailField
                        icon={<User size={16} />}
                        label="Nama Nasabah"
                        value={data.name}
                      />
                      <DetailField
                        icon={<Headphones size={16} />}
                        label="CS Name"
                        value={data.csName}
                      />
                      <DetailField
                        icon={<Phone size={16} />}
                        label="Nomor Telepon"
                        value={data.phoneNumber ?? "-"}
                      />
                      <DetailField
                        icon={<Clock size={16} />}
                        label="Tanggal Panggilan"
                        value={formatCallTimestamp(data.callTimestamp)}
                      />
                      <DetailField
                        icon={<Timer size={16} />}
                        label="Durasi Panggilan"
                        value={data.durationSeconds != null ? `${data.durationSeconds} detik` : "-"}
                      />
                      <DetailField
                        icon={<Smile size={16} />}
                        label="Sentiment Score"
                        value={data.sentimentScore != null ? `${data.sentimentScore}%` : "-"}
                        valueClassName={
                          data.sentimentScore != null
                            ? data.sentimentScore >= 70
                              ? "text-success font-semibold"
                              : "text-red-600 font-semibold"
                            : ""
                        }
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Input
                        label="Nama Nasabah"
                        variant="bordered"
                        radius="sm"
                        value={formData.customerName ?? ""}
                        onChange={(e) =>
                          setFormData((f) => ({ ...f, customerName: e.target.value }))
                        }
                      />
                      <Input
                        label="CS Name"
                        variant="bordered"
                        radius="sm"
                        value={formData.csName ?? ""}
                        onChange={(e) => setFormData((f) => ({ ...f, csName: e.target.value }))}
                      />
                      <Input
                        label="Nomor Telepon"
                        variant="bordered"
                        radius="sm"
                        value={formData.phoneNumber ?? ""}
                        onChange={(e) =>
                          setFormData((f) => ({ ...f, phoneNumber: e.target.value }))
                        }
                      />
                      <Input
                        label="Durasi (detik)"
                        variant="bordered"
                        radius="sm"
                        type="number"
                        value={formData.durationSeconds?.toString() ?? ""}
                        onChange={(e) =>
                          setFormData((f) => ({
                            ...f,
                            durationSeconds: e.target.value ? Number(e.target.value) : undefined,
                          }))
                        }
                      />
                      <Input
                        label="Sentiment Score"
                        variant="bordered"
                        radius="sm"
                        type="number"
                        min={0}
                        max={100}
                        value={formData.sentimentScore?.toString() ?? ""}
                        onChange={(e) =>
                          setFormData((f) => ({
                            ...f,
                            sentimentScore: e.target.value ? Number(e.target.value) : undefined,
                          }))
                        }
                      />
                      <Select
                        label="Status"
                        variant="bordered"
                        radius="sm"
                        selectedKeys={formData.status ? [formData.status] : []}
                        onSelectionChange={(keys) => {
                          const value = Array.from(keys)[0] as ICallMonitoringUpdateReq["status"];
                          setFormData((f) => ({ ...f, status: value }));
                        }}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <SelectItem key={opt.key}>{opt.label}</SelectItem>
                        ))}
                      </Select>
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                {isEditMode ? (
                  <>
                    <Button
                      variant="bordered"
                      radius="sm"
                      onPress={handleCancelEdit}
                      isDisabled={isSubmitting}
                    >
                      Batal
                    </Button>
                    <Button
                      color="primary"
                      radius="sm"
                      onPress={handleSubmit}
                      isLoading={isSubmitting}
                    >
                      Simpan
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="bordered" radius="sm" onPress={onClose}>
                      Tutup
                    </Button>
                    <Button
                      color="primary"
                      radius="sm"
                      startContent={<Pencil size={15} />}
                      onPress={() => setIsEditMode(true)}
                    >
                      Edit
                    </Button>
                  </>
                )}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalDetailCallMonitoring;
