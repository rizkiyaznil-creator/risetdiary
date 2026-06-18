import Link from "next/link";
import { redirect } from "next/navigation";
import { userSekarang } from "@/lib/dal";
import { FormDaftar } from "./form-daftar";
import { TandaTangan } from "../../tanda-tangan";

export default async function HalamanDaftar() {
  if (await userSekarang()) redirect("/dashboard");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <div className="w-full max-w-sm rounded-xl border border-black/10 p-8 dark:border-white/15">
        <h1 className="mb-1 text-2xl font-semibold">Daftar</h1>
        <p className="mb-6 text-sm text-zinc-500">
          Buat akun untuk mulai mencatat riset.
        </p>
        <FormDaftar />
        <p className="mt-6 text-center text-sm text-zinc-500">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Masuk
          </Link>
        </p>
      </div>
      <TandaTangan />
    </main>
  );
}
