import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { dekripsiSesi } from "@/lib/jwt";

// Proxy (dulu "middleware") = kode yang jalan SEBELUM halaman dirender.
// Lapisan cepat untuk mencegah akses /dashboard tanpa sesi.
// Pemeriksaan utama tetap di lib/dal.ts (verifikasiSesi).
export async function proxy(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  const sesi = await dekripsiSesi(token);

  if (!sesi?.userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

// Hanya jalan di rute /dashboard dan turunannya.
export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
