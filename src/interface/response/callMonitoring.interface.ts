export interface ICallMonitoringItem {
  id: string;
  number: string;
  name: string;
  csName: string;
  callTimestamp: string;
  sentimentScore: number | null;
  phoneNumber: string | null;
  durationSeconds: number | null;
  status: "PROSPEK" | "CLOSE" | "REJECT";
}

export interface IPagination {
  currentPage: number;
  totalPages: number;
  totalData: number;
  limit: number;
}

export interface ICallMonitoringListData {
  items: ICallMonitoringItem[];
  pagination: IPagination;
}

export interface ICallMonitoringListResponse {
  status: number;
  message: string;
  data: ICallMonitoringListData;
}
