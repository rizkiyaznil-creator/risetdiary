import Link from "next/link";
import { redirect } from "next/navigation";
import { userSekarang } from "@/lib/dal";
import { FormMasuk } from "./form-masuk";

export default async function HalamanMasuk() {
  // Kalau sudah login, langsung ke dashboard.
  if (await userSekarang()) redirect("/dashboard");

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-xl border border-black/10 p-8 dark:border-white/15">
        <h1 className="mb-1 text-2xl font-semibold">Masuk</h1>
        <p className="mb-6 text-sm text-zinc-500">
          Selamat datang kembali di RisetDiary.
        </p>
        <FormMasuk />
        <p className="mt-6 text-center text-sm text-zinc-500">
          Belum punya akun?{" "}
          <Link
            href="/daftar"
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Daftar
          </Link>
        </p>
      </div>
    </main>
  );
}
