export function getSellingPrice(price, discountAmount) {
  const original = Number(price) || 0;
  const discount = Number(discountAmount) || 0;
  if (discount <= 0) return original;
  return Math.max(0, original - discount);
}

export function hasDiscount(discountAmount) {
  return Number(discountAmount) > 0;
}

export function getDiscountPercent(price, discountAmount) {
  const original = Number(price) || 0;
  const discount = Number(discountAmount) || 0;
  if (original <= 0 || discount <= 0) return 0;
  return Math.round((discount / original) * 100);
}
