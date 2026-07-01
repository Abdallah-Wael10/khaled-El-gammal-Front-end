import { CheckCircle2, Clock3, Package, RotateCcw } from "lucide-react";
import { getOrderStatusLabel, normalizeOrderStatus } from "@/app/utils/orderStatus";

const STATUS_STYLES = {
  pending: {
    className: "border-amber-200 bg-amber-50 text-amber-800",
    Icon: Clock3,
  },
  in_progress: {
    className: "border-sky-200 bg-sky-50 text-sky-800",
    Icon: Package,
  },
  sold: {
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
    Icon: CheckCircle2,
  },
  refunded: {
    className: "border-red-200 bg-red-50 text-red-700",
    Icon: RotateCcw,
  },
};

export default function OrderStatusBadge({ status }) {
  const normalized = normalizeOrderStatus(status);
  const config = STATUS_STYLES[normalized] || STATUS_STYLES.pending;
  const Icon = config.Icon;

  return (
    <span className={`inline-flex min-h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-bold ${config.className}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {getOrderStatusLabel(status)}
    </span>
  );
}
