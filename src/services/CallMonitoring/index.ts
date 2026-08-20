import { useQuery } from "@tanstack/react-query";
import { getListCallMonitoring } from "./https";

export const useGetListCallMonitoring = (
  limit?: string,
  page?: string,
  search?: string,
  startDate?: string,
  endDate?: string,
  sortDir?: "asc" | "desc",
  enabled?: boolean,
) => {
  return useQuery({
    queryKey: ["getListCallMonitoring", limit, page, search, startDate, endDate, sortDir],
    queryFn: () => getListCallMonitoring(limit, page, search, startDate, endDate, sortDir),
    enabled,
  });
};
