"use client";

import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { authClient } from "../lib/auth-client-simple"; 
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react"; 
import { sdk } from '@farcaster/miniapp-sdk';

// Create a mock Convex client for development
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
let convex: ConvexReactClient;

if (convexUrl && !convexUrl.includes('placeholder')) {
  convex = new ConvexReactClient(convexUrl);
} else {
  // Create a mock client that won't cause errors
  convex = new ConvexReactClient('https://mock.convex.dev');
}

(async () => {
  try {
    const isMiniApp = await sdk.isInMiniApp();
    if (isMiniApp) {
      await sdk.actions.ready({ disableNativeGestures: true });
    }
  } catch (error) {
    console.error('Error initializing mini app:', error);
  }
})();

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      {children}
    </ConvexBetterAuthProvider>
  );
}
