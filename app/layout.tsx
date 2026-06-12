import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Micro Quest Board",
  description: "A three-action onchain quest board for Base.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content="6a2bc5580cfd412b2ab2c315" />
        <meta
          name="talentapp:project_verification"
          content="057394f37c4fb7ffdaa315a59803acbdcd590451072ab7e6062cf9313ab7fb980734d265f7664a4305ef5a0b2e079af9a1978552538321995479397512615ee3"
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
