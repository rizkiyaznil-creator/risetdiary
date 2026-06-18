import type { MetadataRoute } from "next";

// Manifest PWA. Next otomatis menautkannya di <head> sebagai
// /manifest.webmanifest karena file ini bernama app/manifest.ts.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RisetDiary",
    short_name: "RisetDiary",
    description: "Catat & pertanggungjawabkan progres riset akademik",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4338ca",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
