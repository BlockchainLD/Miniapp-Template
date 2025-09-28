"use client";

import { ReactNode } from "react";
import { sdk } from '@farcaster/miniapp-sdk';

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

export function SimpleProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
