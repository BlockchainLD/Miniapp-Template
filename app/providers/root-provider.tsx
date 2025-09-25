'use client';

import { ReactNode } from 'react';
import { base } from 'viem/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { ConvexClientProvider } from './convex-client-provider';
import { APP_METADATA } from '../lib/utils';

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || "demo"}
      chain={base}
      config={{
        appearance: {
          mode: 'auto',
          theme: 'default',
          name: APP_METADATA.title,
          logo: APP_METADATA.splash.imageUrl,
        },
        wallet: {
          display: 'modal',
        },
      }}
      miniKit={{
        enabled: true,
        autoConnect: true,
      }}
    >
      <ConvexClientProvider>
        {children}
      </ConvexClientProvider>
    </OnchainKitProvider>
  );
}
