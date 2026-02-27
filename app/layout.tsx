import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { PageTransition } from "@/components/providers/PageTransition";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Groundtruth Labs | Remote Sensing Analytics",
    template: "%s | Groundtruth Labs",
  },
  description:
    "Groundtruth Labs turns aerial and satellite imagery into actionable decisions for agriculture and construction clients across Hawaii.",
  keywords: [
    "drone analytics Hawaii",
    "NDVI mapping",
    "crop stress monitoring",
    "construction site progress",
    "remote sensing",
    "aerial imagery analysis",
  ],
  openGraph: {
    title: "Groundtruth Labs | Remote Sensing Analytics",
    description:
      "Aerial and satellite imagery analytics for Hawaii agriculture and construction.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <PostHogProvider>
          <LenisProvider>
            <PageTransition>{children}</PageTransition>
          </LenisProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
