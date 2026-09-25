import type { Metadata, Viewport } from "next";
import { MedievalSharp, Cinzel_Decorative, Cormorant_Garamond } from "next/font/google";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { CampusMusicProvider } from "@/components/music/CampusMusicContext";
import { CampusMusicModal } from "@/components/music/CampusMusicModal";
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
  metadataBase: new URL("https://campushub.local"),
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
  icons: {
    icon: [
      { url: "/campushub-logo.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/campushub-logo.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/campushub-logo.png",
  },
  openGraph: {
    title: "CampusHub — Magical-Academia Student Companion",
    description:
      "An enchanted, cinematic magical-academia student companion web application.",
    siteName: "CampusHub",
    images: [
      {
        url: "/campushub-logo.png",
        width: 512,
        height: 512,
        alt: "CampusHub Official Logo",
      },
    ],
  },
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
        <AuthProvider>
          <CampusMusicProvider>
            {children}
            <CampusMusicModal />
          </CampusMusicProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
