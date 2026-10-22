import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UltiCode — Open-source programming education",
  description: "An open-source online judge for institutions, instructors and students.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
