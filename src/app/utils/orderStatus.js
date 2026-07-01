export const ORDER_STATUSES = ["pending", "in_progress", "sold", "refunded"];

export const ORDER_STATUS_META = {
  pending: {
    label: "Pending",
    description: "New order, not started",
    tone: "amber",
  },
  in_progress: {
    label: "In Progress",
    description: "Being prepared or shipped",
    tone: "blue",
  },
  sold: {
    label: "Sold",
    description: "Completed sale (reduces stock)",
    tone: "emerald",
  },
  refunded: {
    label: "Refunded",
    description: "Returned (restores stock if previously sold)",
    tone: "red",
  },
};

export function normalizeOrderStatus(status) {
  if (status === "active") return "in_progress";
  return status || "pending";
}

export function getOrderStatusLabel(status) {
  const normalized = normalizeOrderStatus(status);
  return ORDER_STATUS_META[normalized]?.label || normalized;
}

export function getOrderStatusDescription(status) {
  const normalized = normalizeOrderStatus(status);
  return ORDER_STATUS_META[normalized]?.description || "";
}

export function isOpenOrder(status) {
  const normalized = normalizeOrderStatus(status);
  return normalized === "pending" || normalized === "in_progress";
}

export function requiresStockConfirmation(status) {
  const normalized = normalizeOrderStatus(status);
  return normalized === "sold" || normalized === "refunded";
}

export function getStockConfirmationMessage(status) {
  const normalized = normalizeOrderStatus(status);
  if (normalized === "sold") {
    return "This will reduce product stock by the ordered quantities.";
  }
  if (normalized === "refunded") {
    return "This will restore stock only if this order was previously marked Sold.";
  }
  return "";
}
