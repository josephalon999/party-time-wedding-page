import type { Metadata } from "next";
import { Assistant, Noto_Serif_Hebrew } from "next/font/google";
import "./globals.css";

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
  title: "Party Time למתחתנים | ריקוד פתיחה שתזכרו לכל החיים",
  description:
    "תהליך לזוגות שרוצים להרגיש חופשיים ומחוברים בריקוד הפתיחה בחתונה — בלי בושה, בלי פחד, עם יוסף אלון | Passion For Action",
  openGraph: {
    title: "Party Time למתחתנים | ריקוד פתיחה שתזכרו לכל החיים",
    description: "200 אנשים אוהבים יסתכלו עליכם. תרגישו חופשיים ברגע הזה.",
    locale: "he_IL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={`${assistant.variable} ${notoSerifHebrew.variable}`}>
      <body>{children}</body>
    </html>
  );
}
