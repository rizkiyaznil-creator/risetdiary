// Service worker minimal — memenuhi syarat agar aplikasi bisa di-"install" (PWA).
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {
  // Tidak meng-cache; biarkan browser menangani permintaan secara normal.
});
