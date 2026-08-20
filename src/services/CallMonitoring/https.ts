import type { ICallMonitoringListResponse } from "@/interface/response/callMonitoring.interface";
import type {
  ICallMonitoringCreateReq,
  ICallMonitoringFilterReq,
  ICallMonitoringUpdateReq,
} from "@/interface/request/callMonitoring.interface";
import axios from "@/api/axios";

export const getListCallMonitoring = async (
  filters: ICallMonitoringFilterReq,
): Promise<ICallMonitoringListResponse> => {
  const { data } = await axios.get("/api/v1/call-monitoring", { params: filters });
  return data;
};

export const createCallMonitoring = async (body: ICallMonitoringCreateReq) => {
  const { data } = await axios.post("/api/v1/call-monitoring", body);
  return data;
};

export const editCallMonitoring = async (body: ICallMonitoringUpdateReq, id: string) => {
  const { data } = await axios.put(`/api/v1/call-monitoring/${id}`, body);
  return data;
};
