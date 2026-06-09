import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Encuentro de Talentos",
    short_name: "ET Talentos",
    description: "Concursos, escenario live y camerino para artistas.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#020617",
    theme_color: "#06172f",
    categories: ["entertainment", "music", "social"],
    lang: "es-MX",
    icons: [
      {
        src: "/app-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/app-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/et-portada.png",
        sizes: "1254x1254",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
  };
}
