import { ListChecks } from "lucide-react";

interface SummaryCardsProps {
  totalData: number;
  isLoading: boolean;
}

export default function SummaryCards({ totalData, isLoading }: SummaryCardsProps) {
  return (
    <div className="flex min-w-40 items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2">
      <div className="flex h-8 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-secondary text-primary">
        <ListChecks size={17} />
      </div>
      <div>
        <p className="text-xs text-primary">Total Data</p>
        {isLoading ? (
          <div className="mt-1 h-5 w-10 animate-pulse rounded bg-gray-200" />
        ) : (
          <p className="text-lg font-bold text-gray-800">{totalData}</p>
        )}
      </div>
    </div>
  );
}
