const INVALID_IMAGE_VALUES = new Set(["", "undefined", "null", "false", "nan"]);

export function cleanImageValue(value) {
  if (typeof value !== "string") return "";
  const clean = value.trim();
  if (INVALID_IMAGE_VALUES.has(clean.toLowerCase())) return "";
  return clean;
}

export function getUploadImageUrl(value, baseUrl = process.env.NEXT_PUBLIC_API_URL) {
  const clean = cleanImageValue(value);
  if (!clean) return "";
  if (/^(https?:)?\/\//i.test(clean) || clean.startsWith("data:") || clean.startsWith("blob:")) return clean;

  const root = cleanImageValue(baseUrl).replace(/\/$/, "");
  if (!root) return "";

  const filename = clean.replace(/^\/?uploads\/?/i, "").replace(/^\/+/, "");
  if (!filename) return "";

  return `${root}/uploads/${encodeURI(filename)}`;
}

export function normalizeImageCandidates(candidates = []) {
  const seen = new Set();

  return candidates
    .map((candidate) => cleanImageValue(candidate))
    .filter(Boolean)
    .filter((candidate) => {
      if (seen.has(candidate)) return false;
      seen.add(candidate);
      return true;
    });
}

export function getProductImageCandidates(product, baseUrl = process.env.NEXT_PUBLIC_API_URL) {
  if (!product) return [];

  const rawCandidates = [
    ...(Array.isArray(product.availableImages) ? product.availableImages : []),
    product.displayImage,
    ...(Array.isArray(product.imageCandidates) ? product.imageCandidates : []),
    product.mainImage || product.image,
    ...(Array.isArray(product.images) ? product.images : []),
  ];

  return normalizeImageCandidates(rawCandidates.map((candidate) => getUploadImageUrl(candidate, baseUrl)));
}
