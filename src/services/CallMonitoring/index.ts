import { useMutation, useQuery } from "@tanstack/react-query";
import { createCallMonitoring, editCallMonitoring, getListCallMonitoring } from "./https";
import type {
  ICallMonitoringCreateReq,
  ICallMonitoringFilterReq,
  ICallMonitoringUpdateReq,
} from "@/interface/request/callMonitoring.interface";

export const useGetListCallMonitoring = (filters: ICallMonitoringFilterReq, enabled?: boolean) => {
  return useQuery({
    queryKey: ["getListCallMonitoring", filters],
    queryFn: () => getListCallMonitoring(filters),
    enabled,
  });
};

export const useCreateCallMonitoring = () => {
  return useMutation({
    mutationKey: ["CreateCallMonitoring"],
    mutationFn: (body: ICallMonitoringCreateReq) => createCallMonitoring(body),
  });
};

export const useEditCallMonitoring = () => {
  return useMutation({
    mutationKey: ["EditCallMonitoring"],
    mutationFn: ({ body, id }: { body: ICallMonitoringUpdateReq; id: string }) =>
      editCallMonitoring(body, id),
  });
};
