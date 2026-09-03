import { MedievalSharp, Cinzel_Decorative, Cormorant_Garamond } from "next/font/google";

export const medievalFont = MedievalSharp({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const cinzelFont = Cinzel_Decorative({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const cormorantFont = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});
