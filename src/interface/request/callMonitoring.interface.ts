export interface ICallMonitoringFilterReq {
  search?: string;
  startDate?: string;
  endDate?: string;
  sentiment?: "BELOW_70" | "GTE_70";
  status?: "PROSPEK" | "CLOSE" | "REJECT";
  sortBy?: "callId" | "callTimestamp" | "csName" | "customerName" | "sentimentScore";
  sortDir?: "asc" | "desc";
  page?: number;
  size?: number;
}
