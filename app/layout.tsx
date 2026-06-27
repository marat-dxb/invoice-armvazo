import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ConsultX Invoice - Armvazo Management Consultancies LLC",
  description:
    "Invoice and payment request page for Armvazo Management Consultancies LLC by ConsultX Corporate Solutions.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
