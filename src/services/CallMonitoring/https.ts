import type { ICallMonitoringListResponse } from "@/interface/response/callMonitoring.interface";
import axios from "@/api/axios";

export const getListCallMonitoring = async (
  size?: string,
  page?: string,
  search?: string,
  startDate?: string,
  endDate?: string,
  sortDir?: "asc" | "desc",
): Promise<ICallMonitoringListResponse> => {
  let endpoint = `/api/v1/call-monitoring`;
  if (size) endpoint += `?size=${size}`;
  if (page) endpoint += `&page=${page}`;
  const params: { [key: string]: unknown } = {};
  if (search) params.search = search;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  if (sortDir) params.sortDir = sortDir;
  const { data } = await axios.get(endpoint, { params });
  return data;
};
