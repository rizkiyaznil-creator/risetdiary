"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const kelasTombol =
  "rounded-md border border-black/15 px-3 py-1.5 text-sm hover:bg-black/[.04] dark:border-white/20 dark:hover:bg-white/[.06]";

export function PwaButtons() {
  const [bisaPasang, setBisaPasang] = useState(false);
  const [pesan, setPesan] = useState<string | null>(null);

  useEffect(() => {
    const cek = () =>
      setBisaPasang(
        Boolean(
          (window as unknown as { _risetPwaPrompt?: unknown })._risetPwaPrompt,
        ),
      );
    cek();
    window.addEventListener("riset-pwa-available", cek);
    const onInstalled = () => setBisaPasang(false);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("riset-pwa-available", cek);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function pasang() {
    const w = window as unknown as {
      _risetPwaPrompt?: BeforeInstallPromptEvent;
    };
    const ev = w._risetPwaPrompt;
    if (!ev) return;
    await ev.prompt();
    await ev.userChoice;
    w._risetPwaPrompt = undefined;
    setBisaPasang(false);
  }

  async function bagikan() {
    const url = window.location.origin;
    const data = {
      title: "RisetDiary",
      text: "Catat & pantau progres risetmu di RisetDiary",
      url,
    };
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        // user membatalkan share — abaikan
      }
      return;
    }
    // Fallback: salin tautan ke clipboard
    try {
      await navigator.clipboard.writeText(url);
      setPesan("Tautan disalin!");
      setTimeout(() => setPesan(null), 2000);
    } catch {
      setPesan(url);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {pesan && (
        <span className="text-xs text-green-600 dark:text-green-400">
          {pesan}
        </span>
      )}
      <button type="button" onClick={bagikan} className={kelasTombol}>
        🔗 Bagikan
      </button>
      {bisaPasang && (
        <button type="button" onClick={pasang} className={kelasTombol}>
          ⬇️ Pasang
        </button>
      )}
    </div>
  );
}
