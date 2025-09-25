import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@worldcoin/mini-apps-ui-kit-react/styles.css";
import { ConvexClientProvider } from "./providers/convex-client-provider";
import { Provider as WagmiProvider } from './providers/wagmi-provider';
import { APP_METADATA, fcMiniAppEmbed } from "./lib/utils";
import { Toaster } from "@worldcoin/mini-apps-ui-kit-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fcMiniApp = JSON.stringify(fcMiniAppEmbed())

export const metadata: Metadata = {
  title: APP_METADATA.title,
  description: APP_METADATA.description,
  other: {
    "fc:frame": fcMiniApp,
    "fc:miniapp": fcMiniApp,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WagmiProvider>
          <ConvexClientProvider>
            {children}
            <Toaster />
          </ConvexClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
