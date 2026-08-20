import type { ICallMonitoringListResponse } from "@/interface/response/callMonitoring.interface";
import type { ICallMonitoringFilterReq } from "@/interface/request/callMonitoring.interface";
import axios from "@/api/axios";

export const getListCallMonitoring = async (
  filters: ICallMonitoringFilterReq,
): Promise<ICallMonitoringListResponse> => {
  const { data } = await axios.get("/api/v1/call-monitoring", { params: filters });
  return data;
};
