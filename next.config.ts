import type { NextConfig } from "next";

// Header keamanan dasar untuk semua rute.
const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" }, // anti clickjacking
  { key: "X-Content-Type-Options", value: "nosniff" }, // anti MIME-sniffing
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
