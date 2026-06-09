import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import BackgroundVideo from "@/components/BackgroundVideo";
import Navbar from "@/components/Navbar";
import ConditionalFooter from "@/components/ConditionalFooter";

export const metadata: Metadata = {
  metadataBase: new URL("https://encuentrodetalentos.com"),
  applicationName: "Encuentro de Talentos",
  title: "Encuentro de Talentos",
  description: "Diviértete. Participa. Gana premios.",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
    languages: {
      "es-MX": "/",
      es: "/",
    },
  },
  openGraph: {
    title: "Encuentro de Talentos",
    description: "Diviértete. Participa. Gana premios.",
    locale: "es_MX",
    type: "website",
  },
  formatDetection: {
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ET Talentos",
  },
  icons: {
    icon: [
      { url: "/app-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/app-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#06172f",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX" dir="ltr" translate="yes">
      <head>
        <meta httpEquiv="Content-Language" content="es-MX" />
        <meta name="theme-color" content="#06172f" />
      </head>
      <body>
        <BackgroundVideo />
        <Navbar />
        {children}
        <ConditionalFooter />
        <Analytics />
      </body>
    </html>
  );
}
