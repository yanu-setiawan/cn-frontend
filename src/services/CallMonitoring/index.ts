import { useQuery } from "@tanstack/react-query";
import { getListCallMonitoring } from "./https";
import type { ICallMonitoringFilterReq } from "@/interface/request/callMonitoring.interface";

export const useGetListCallMonitoring = (filters: ICallMonitoringFilterReq, enabled?: boolean) => {
  return useQuery({
    queryKey: ["getListCallMonitoring", filters],
    queryFn: () => getListCallMonitoring(filters),
    enabled,
  });
};
