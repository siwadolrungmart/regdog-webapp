import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Anuphan } from "next/font/google";
import { DogRegistrationProvider } from "@/contexts/dog-registration-context";

const anuphan = Anuphan({
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-sarabun",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RegDog",
  description: "Register and manage dog events",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${anuphan.variable} ${inter.variable} antialiased`}
        style={{ fontFamily: '"Anuphan", "Inter", sans-serif' }}
      >
        <DogRegistrationProvider>{children}</DogRegistrationProvider>
      </body>
    </html>
  );
}
