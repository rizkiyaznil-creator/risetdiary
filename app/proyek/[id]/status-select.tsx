"use client";

import { ubahStatusLog } from "../actions";
import { STATUS } from "@/lib/constants";

// Select status yang langsung menyimpan saat diubah (tanpa tombol).
export function StatusSelect({
  logId,
  status,
}: {
  logId: string;
  status: string;
}) {
  return (
    <form action={ubahStatusLog}>
      <input type="hidden" name="logId" value={logId} />
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
