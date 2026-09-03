import type { Metadata, Viewport } from "next";
import "./globals.css";

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
    <html lang="en" className="dark h-full">
      <body className="min-h-full flex flex-col bg-[#060b13] text-[#f1ede4] antialiased selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
