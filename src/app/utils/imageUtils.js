import { useEffect, useState } from "react";

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
export const MAX_GALLERY_IMAGES = 10;

const COMPRESS_THRESHOLD = 1024 * 1024;
const MAX_WIDTH = 1920;
const JPEG_QUALITY = 0.85;

export function validateImageFile(file) {
  if (!file) return "No file selected";
  if (file.size > MAX_IMAGE_SIZE) return "Image must be under 10MB";
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!["jpeg", "jpg", "png", "webp"].includes(ext)) {
    return "Only jpeg, jpg, png, and webp images are allowed";
  }
  return null;
}

export async function compressImageIfNeeded(file) {
  if (!file || file.size <= COMPRESS_THRESHOLD) return file;

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          resolve(
            new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" })
          );
        },
        "image/jpeg",
        JPEG_QUALITY
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };
    img.src = objectUrl;
  });
}

export function useObjectUrl(file) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return undefined;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url;
}
