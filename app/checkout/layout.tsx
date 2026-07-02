import type { Metadata } from "next";
import { Assistant, Noto_Serif_Hebrew } from "next/font/google";
import "../globals.css";

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  variable: "--font-assistant",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSerifHebrew = Noto_Serif_Hebrew({
  subsets: ["hebrew"],
  variable: "--font-noto-serif",
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Party Time למתחתנים | השלמת רכישה",
  robots: { index: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${assistant.variable} ${notoSerifHebrew.variable}`}>
      <body style={{ background: "#120b1a", color: "#f5f0e8" }}>{children}</body>
    </html>
  );
}
