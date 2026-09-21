/**
 * Mengonversi file gambar (jpg/png/dll) menjadi WEBP di sisi client
 * menggunakan Canvas API, sebelum diunggah ke storage.
 *
 * @param file       File gambar asli dari <input type="file">
 * @param maxWidth   Lebar maksimum hasil resize (menjaga ukuran file tetap kecil)
 * @param quality    Kualitas kompresi WEBP (0-1)
 */
export async function convertImageToWebp(
  file: File,
  maxWidth = 1600,
  quality = 0.85
): Promise<File> {
  const bitmap = await createImageBitmap(file);

  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context tidak tersedia di browser ini.");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/webp", quality)
  );

  if (!blob) {
    throw new Error("Gagal mengonversi gambar ke format WEBP.");
  }

  const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
  return new File([blob], newName, { type: "image/webp" });
}

/** Buat preview URL sementara untuk ditampilkan sebelum upload. */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}
