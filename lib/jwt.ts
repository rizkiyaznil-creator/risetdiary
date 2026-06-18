// Enkripsi & dekripsi token session memakai JWT (pustaka "jose").
// File ini SENGAJA tidak mengimpor next/headers agar aman dipakai di
// "proxy.ts" yang berjalan di edge runtime.
import { SignJWT, jwtVerify } from "jose";

export type SesiPayload = {
  userId: string;
  expiresAt: string; // disimpan sebagai ISO string
};

const secret = process.env.SESSION_SECRET ?? "";
const encodedKey = new TextEncoder().encode(secret);

export async function enkripsiSesi(payload: SesiPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function dekripsiSesi(
  token?: string,
): Promise<SesiPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    if (typeof payload.userId !== "string") return null;
    return {
      userId: payload.userId,
      expiresAt:
        typeof payload.expiresAt === "string" ? payload.expiresAt : "",
    };
  } catch {
    // Token tidak valid / kedaluwarsa
    return null;
  }
}
