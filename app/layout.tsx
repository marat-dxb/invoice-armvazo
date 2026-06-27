import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Инвойс ConsultX - Armvazo Management Consultancies LLC",
  description:
    "Инвойс и реквизиты оплаты для Armvazo Management Consultancies LLC от ConsultX Corporate Solutions.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
