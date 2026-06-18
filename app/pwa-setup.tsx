"use client";

import { useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Komponen tak terlihat di root layout: mendaftarkan service worker dan
// menangkap event "beforeinstallprompt" sedini mungkin (sebelum user sampai
// ke dashboard) lalu menyimpannya agar bisa dipakai tombol "Pasang".
export function PwaSetup() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // abaikan bila gagal (mis. saat http non-localhost)
      });
    }

    const onPrompt = (e: Event) => {
      e.preventDefault(); // tahan mini-infobar bawaan; kita pakai tombol sendiri
      (
        window as unknown as { _risetPwaPrompt?: BeforeInstallPromptEvent }
      )._risetPwaPrompt = e as BeforeInstallPromptEvent;
      window.dispatchEvent(new Event("riset-pwa-available"));
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  return null;
}
