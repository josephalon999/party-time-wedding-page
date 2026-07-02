import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import "./globals.css";

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Party Time לגרושים | יוסף אלון — Passion For Action",
  description:
    "המסלול לגרושים שרוצים להשתחרר ברחבת הריקודים, לבנות ביטחון עצמי — ואולי גם להכיר מישהי. יוסף אלון, 14 שנות ניסיון, שיטת 'תנועה יוצרת מציאות'.",
  openGraph: {
    title: "Party Time לגרושים | יוסף אלון",
    description: "לא עוד חתונה שתעמוד בה בצד. הגיע הזמן שאתה תהיה מישהו שחי.",
    locale: "he_IL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${assistant.variable} antialiased font-sans`}>{children}</body>
    </html>
  );
}
