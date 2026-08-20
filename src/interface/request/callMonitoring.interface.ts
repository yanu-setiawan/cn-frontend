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

export interface FilterState {
  search: string;
  pageIndex: number;
  pageSize: number;
  startDate: string;
  endDate: string;
  sentiment: "BELOW_70" | "GTE_70" | "ALL";
  status: "PROSPEK" | "CLOSE" | "REJECT" | "ALL";
  sortBy: "callId" | "callTimestamp" | "csName" | "customerName" | "sentimentScore";
  sortDir: "asc" | "desc";
}

export interface ICallMonitoringCreateReq {
  customerName?: string;
  phoneNumber?: string;
  csName?: string;
  sentimentScore?: string;
  durationSeconds?: string;
  status?: "PROSPEK" | "CLOSE" | "REJECT";
}

export interface ICallMonitoringUpdateReq {
  customerName?: string;
  phoneNumber?: string;
  csName?: string;
  sentimentScore?: number;
  durationSeconds?: number;
  status?: "PROSPEK" | "CLOSE" | "REJECT";
}
