export const SENTIMENT_OPTIONS = [
  { key: "ALL", label: "Semua Sentimen" },
  { key: "GTE_70", label: "≥ 70 (Positif)" },
  { key: "BELOW_70", label: "< 70 (Negatif)" },
];

export const STATUS_OPTIONS = [
  { key: "ALL", label: "Semua Status" },
  { key: "PROSPEK", label: "Prospek" },
  { key: "CLOSE", label: "Close" },
  { key: "REJECT", label: "Reject" },
];

export const SORT_BY_OPTIONS = [
  { key: "callTimestamp", label: "Tanggal Panggilan" },
  { key: "csName", label: "Nama CS" },
  { key: "customerName", label: "Nama Nasabah" },
  { key: "sentimentScore", label: "Skor Sentimen" },
  { key: "callId", label: "ID Panggilan" },
];
