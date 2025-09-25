import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@worldcoin/mini-apps-ui-kit-react/styles.css";
import { ConvexClientProvider } from "./providers/convex-client-provider";
import { Provider as WagmiProvider } from './providers/wagmi-provider';
import { APP_METADATA, fcMiniAppEmbed } from "./lib/utils";
import { Toaster } from "@worldcoin/mini-apps-ui-kit-react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "viem/chains";

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
          <OnchainKitProvider 
            chain={base}
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || "demo"}
            miniKit={{ enabled: true }}
          >
            <ConvexClientProvider>
              {children}
              <Toaster />
            </ConvexClientProvider>
          </OnchainKitProvider>
        </WagmiProvider>
        
        {/* Farcaster Mini App SDK Ready Signal */}
        <script type="module" dangerouslySetInnerHTML={{
          __html: `
            import { sdk } from 'https://esm.sh/@farcaster/miniapp-sdk'
            
            // After your app is fully loaded and ready to display
            await sdk.actions.ready()
          `
        }} />
      </body>
    </html>
  );
}
