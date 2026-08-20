import { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Button,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import toast from "react-hot-toast";
import type { ICallMonitoringCreateReq } from "@/interface/request/callMonitoring.interface";

interface ModalCreateCallMonitoringProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitCreate: (payload: ICallMonitoringCreateReq) => void;
  isSubmitting?: boolean;
}

const STATUS_OPTIONS = [
  { key: "PROSPEK", label: "Prospek" },
  { key: "CLOSE", label: "Close" },
  { key: "REJECT", label: "Reject" },
];

const DEFAULT_FORM: ICallMonitoringCreateReq = {
  customerName: "",
  phoneNumber: "",
  csName: "",
  sentimentScore: 0,
  durationSeconds: 0,
  status: "PROSPEK",
};

const ModalCreateCallMonitoring: React.FC<ModalCreateCallMonitoringProps> = ({
  isOpen,
  onOpenChange,
  onSubmitCreate,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<ICallMonitoringCreateReq>(DEFAULT_FORM);

  useEffect(() => {
    if (isOpen) {
      setFormData(DEFAULT_FORM);
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    if (!formData.customerName || !formData.customerName.trim()) {
      toast.error("Nama nasabah wajib diisi");
      return false;
    }
    if (!formData.phoneNumber || !formData.phoneNumber.trim()) {
      toast.error("Nomor telepon wajib diisi");
      return false;
    }
    if (!formData.csName || !formData.csName.trim()) {
      toast.error("CS Name wajib diisi");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const payload: ICallMonitoringCreateReq = {
      customerName: formData.customerName || "",
      phoneNumber: formData.phoneNumber || "",
      csName: formData.csName || "",
      sentimentScore: Number(formData.sentimentScore) || 0,
      durationSeconds: Number(formData.durationSeconds) || 0,
      status: formData.status,
    };

    onSubmitCreate(payload);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="border-b border-gray-300 px-6 py-4">
              <span className="font-bold text-xl text-gray-800">Tambah Call Monitoring</span>
            </ModalHeader>

            <ModalBody className="p-6 gap-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="Nama Nasabah"
                  placeholder="Masukkan nama nasabah"
                  variant="bordered"
                  radius="sm"
                  isRequired
                  value={formData.customerName}
                  onValueChange={(value) => setFormData((f) => ({ ...f, customerName: value }))}
                />
                <Input
                  label="CS Name"
                  placeholder="Masukkan nama CS"
                  variant="bordered"
                  radius="sm"
                  isRequired
                  value={formData.csName}
                  onValueChange={(value) => setFormData((f) => ({ ...f, csName: value }))}
                />
                <Input
                  label="Nomor Telepon"
                  placeholder="Masukkan nomor telepon"
                  variant="bordered"
                  radius="sm"
                  isRequired
                  value={formData.phoneNumber}
                  onValueChange={(value) => setFormData((f) => ({ ...f, phoneNumber: value }))}
                />
                <Select
                  label="Status"
                  variant="bordered"
                  radius="sm"
                  disallowEmptySelection
                  selectedKeys={formData.status ? [formData.status] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as ICallMonitoringCreateReq["status"];
                    setFormData((f) => ({ ...f, status: value }));
                  }}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.key}>{opt.label}</SelectItem>
                  ))}
                </Select>
                <Input
                  label="Sentiment Score"
                  placeholder="0"
                  variant="bordered"
                  radius="sm"
                  type="number"
                  min={0}
                  max={100}
                  value={String(formData.sentimentScore ?? 0)}
                  onValueChange={(value) =>
                    setFormData((f) => ({ ...f, sentimentScore: Number(value) || 0 }))
                  }
                />
                <Input
                  label="Durasi (detik)"
                  placeholder="0"
                  variant="bordered"
                  radius="sm"
                  type="number"
                  min={0}
                  value={String(formData.durationSeconds ?? 0)}
                  onValueChange={(value) =>
                    setFormData((f) => ({ ...f, durationSeconds: Number(value) || 0 }))
                  }
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button variant="bordered" radius="sm" onPress={onClose} isDisabled={isSubmitting}>
                  Batal
                </Button>
                <Button color="primary" radius="sm" onPress={handleSubmit} isLoading={isSubmitting}>
                  Simpan
                </Button>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalCreateCallMonitoring;
