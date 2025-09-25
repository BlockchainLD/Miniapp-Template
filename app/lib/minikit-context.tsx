"use client";

// Custom MiniKit-compatible context implementation
// Following Base Mini App Context documentation patterns
// without using the problematic OnchainKitProvider

import { useState, useEffect, createContext, useContext } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export interface MiniKitUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
}

export interface MiniKitClient {
  clientFid: number;
  added: boolean;
  platformType: 'mobile' | 'desktop';
  safeAreaInsets: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface MiniKitLocation {
  type: 'launcher' | 'cast_embed' | 'messaging';
  cast?: {
    author: MiniKitUser;
    text: string;
    timestamp: string;
    hash: string;
  };
}

export interface MiniKitContext {
  user?: MiniKitUser;
  client?: MiniKitClient;
  location?: MiniKitLocation;
}

interface MiniKitContextType {
  context: MiniKitContext | null;
  isFrameReady: boolean;
  setFrameReady: () => void;
  isInMiniApp: boolean;
}

const MiniKitContext = createContext<MiniKitContextType | null>(null);

export function useMiniKit() {
  const context = useContext(MiniKitContext);
  if (!context) {
    throw new Error('useMiniKit must be used within a MiniKitProvider');
  }
  return context;
}

export function useIsInMiniApp() {
  const [isInMiniApp, setIsInMiniApp] = useState(false);

  useEffect(() => {
    const checkMiniApp = async () => {
      try {
        const inMiniApp = await sdk.isInMiniApp();
        setIsInMiniApp(inMiniApp);
      } catch (error) {
        console.error('Error checking Mini App status:', error);
        setIsInMiniApp(false);
      }
    };
    checkMiniApp();
  }, []);

  return { isInMiniApp };
}

export function useAuthenticate() {
  const signIn = async () => {
    try {
      // For now, return true as authentication is handled by our simple auth system
      // This maintains compatibility with MiniKit patterns
      return true;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  };

  return { signIn };
}

export function MiniKitProvider({ children }: { children: React.ReactNode }) {
  const [context, setContext] = useState<MiniKitContext | null>(null);
  const [isFrameReady, setIsFrameReady] = useState(false);
  const [isInMiniApp, setIsInMiniApp] = useState(false);

  useEffect(() => {
    const initializeMiniKit = async () => {
      try {
        // Check if we're in a Mini App
        const inMiniApp = await sdk.isInMiniApp();
        setIsInMiniApp(inMiniApp);

        if (inMiniApp) {
          // Get context data from Farcaster SDK
          const contextData = await sdk.getContext();
          
          // Transform to MiniKit format
          const miniKitContext: MiniKitContext = {
            user: contextData.user ? {
              fid: contextData.user.fid,
              username: contextData.user.username,
              displayName: contextData.user.displayName,
              pfpUrl: contextData.user.pfpUrl,
            } : undefined,
            client: contextData.client ? {
              clientFid: contextData.client.clientFid,
              added: contextData.client.added,
              platformType: contextData.client.platformType,
              safeAreaInsets: contextData.client.safeAreaInsets,
            } : undefined,
            location: contextData.location ? {
              type: contextData.location.type,
              cast: contextData.location.cast ? {
                author: {
                  fid: contextData.location.cast.author.fid,
                  username: contextData.location.cast.author.username,
                  displayName: contextData.location.cast.author.displayName,
                  pfpUrl: contextData.location.cast.author.pfpUrl,
                },
                text: contextData.location.cast.text,
                timestamp: contextData.location.cast.timestamp,
                hash: contextData.location.cast.hash,
              } : undefined,
            } : undefined,
          };

          setContext(miniKitContext);
        }
      } catch (error) {
        console.error('Failed to initialize MiniKit:', error);
      }
    };

    initializeMiniKit();
  }, []);

  const setFrameReady = () => {
    setIsFrameReady(true);
    // Signal readiness to Farcaster SDK
    sdk.actions.ready();
  };

  return (
    <MiniKitContext.Provider value={{
      context,
      isFrameReady,
      setFrameReady,
      isInMiniApp,
    }}>
      {children}
    </MiniKitContext.Provider>
  );
}
