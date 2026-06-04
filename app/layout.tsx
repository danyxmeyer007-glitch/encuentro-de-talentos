import type { Metadata } from "next";
import "./globals.css";
import BackgroundVideo from "@/components/BackgroundVideo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Encuentro de Talentos",
  description: "Diviértete. Participa. Gana premios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <BackgroundVideo />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}