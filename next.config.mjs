/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Karena gambar bisa datang dari Supabase Storage ATAU dari
    // berbagai website hosting gambar eksternal, optimasi gambar
    // bawaan Next.js dimatikan supaya tidak perlu allowlist domain
    // satu per satu. Kalau nanti mau optimasi otomatis, ganti
    // `unoptimized: true` dengan daftar `remotePatterns` domain
    // yang dipakai.
    unoptimized: true,
  },
};

export default nextConfig;
