import type { Metadata, Viewport } from "next";
import { MedievalSharp, Cinzel_Decorative, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const medievalSharp = MedievalSharp({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-medieval",
  display: "swap",
});

const cinzelDecorative = Cinzel_Decorative({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CampusHub — Magical-Academia Student Companion",
  description:
    "An enchanted, cinematic magical-academia student companion web application.",
  keywords: [
    "CampusHub",
    "student companion",
    "attendance tracker",
    "college canteen",
    "owl post",
    "magical academia",
  ],
  authors: [{ name: "CampusHub Contributors" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#060b13",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark h-full ${medievalSharp.variable} ${cinzelDecorative.variable} ${cormorantGaramond.variable}`}
    >
      <body className="min-h-full flex flex-col bg-[#03060a] text-[#D6D9D4] font-cormorant antialiased selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
