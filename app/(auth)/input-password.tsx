"use client";

import { useState, type InputHTMLAttributes } from "react";

// Input password dengan tombol mata untuk melihat/menyembunyikan isinya
// saat diketik. Default tetap tersembunyi demi keamanan.
export function InputPassword(props: InputHTMLAttributes<HTMLInputElement>) {
  const [lihat, setLihat] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={lihat ? "text" : "password"}
        className="w-full rounded-md border border-black/15 bg-transparent px-3 py-2 pr-10 outline-none focus:border-blue-500 dark:border-white/20"
      />
      <button
        type="button"
        onClick={() => setLihat((v) => !v)}
        aria-label={lihat ? "Sembunyikan password" : "Lihat password"}
        title={lihat ? "Sembunyikan" : "Lihat"}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        {lihat ? "🙈" : "👁️"}
      </button>
    </div>
  );
}
