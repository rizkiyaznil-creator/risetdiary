"use client";

import { STATUS } from "@/lib/constants";

// Select status yang langsung menyimpan saat diubah. Dipakai ulang untuk
// log maupun milestone — server action-nya dikirim lewat prop "action".
export function StatusSelect({
  action,
  idName,
  idValue,
  status,
}: {
  action: (formData: FormData) => void | Promise<void>;
  idName: string;
  idValue: string;
  status: string;
}) {
  return (
    <form action={action}>
      <input type="hidden" name={idName} value={idValue} />
      <select
        name="status"
        defaultValue={status}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-md border border-black/15 bg-transparent px-2 py-1 text-xs outline-none dark:border-white/20"
      >
        {Object.entries(STATUS).map(([k, v]) => (
          <option key={k} value={k}>
            {v}
          </option>
        ))}
      </select>
    </form>
  );
}
