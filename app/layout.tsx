import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import BackgroundVideo from "@/components/BackgroundVideo";
import Navbar from "@/components/Navbar";
import ConditionalFooter from "@/components/ConditionalFooter";

export const metadata: Metadata = {
  metadataBase: new URL("https://encuentro-de-talentos.vercel.app"),
  title: "Encuentro de Talentos",
  description: "Diviértete. Participa. Gana premios.",
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
