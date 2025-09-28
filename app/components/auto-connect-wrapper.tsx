"use client";

import { ReactNode, useEffect, useState, createContext, useContext } from "react";
import { useAccount, useConnect } from "wagmi";
import { sdk } from '@farcaster/miniapp-sdk';

interface FarcasterContextType {
  fid: number | null;
  isInMiniApp: boolean;
}

const FarcasterContext = createContext<FarcasterContextType>({
  fid: null,
  isInMiniApp: false,
});

export const useFarcaster = () => useContext(FarcasterContext);

interface AutoConnectWrapperProps {
  children: ReactNode;
}

export function AutoConnectWrapper({ children }: AutoConnectWrapperProps) {
  const { isConnected, isConnecting } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const [autoConnectAttempted, setAutoConnectAttempted] = useState(false);
  const [fid, setFid] = useState<number | null>(null);

  useEffect(() => {
    const checkMiniApp = async () => {
      try {
        const inMiniApp = await sdk.isInMiniApp();
        setIsInMiniApp(inMiniApp);
        
        // Get FID from Farcaster context if available
        if (inMiniApp) {
          try {
            const context = await sdk.context;
            if (context?.user?.fid) {
              setFid(context.user.fid);
            }
          } catch (error) {
            console.log('Error getting Farcaster context:', error);
          }
        }
        
        // If we're in a mini app and not connected, try to auto-connect
        if (inMiniApp && !isConnected && !autoConnectAttempted) {
          setAutoConnectAttempted(true);
          const farcasterConnector = connectors.find(connector => 
            connector.type === 'farcasterMiniApp' || 
            connector.name.toLowerCase().includes('farcaster')
          );
          
          if (farcasterConnector) {
            try {
              await connectAsync({ connector: farcasterConnector });
            } catch (error) {
              console.log('Auto-connect failed:', error);
            }
          }
        }
      } catch (error) {
        console.log('Error checking mini app status:', error);
        setIsInMiniApp(false);
      }
    };

    checkMiniApp();
  }, [isConnected, autoConnectAttempted, connectAsync, connectors]);

  // If we're in a mini app and connecting, show loading state
  if (isInMiniApp && isConnecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-7 space-y-7 text-center">
          <div className="space-y-3">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
            <h2 className="font-sans antialiased font-semibold leading-narrow tracking-[-0.01em] text-2xl text-gray-900">
              Connecting Wallet...
            </h2>
            <p className="font-sans antialiased font-normal leading-compact text-base text-gray-600">
              Auto-connecting to your wallet in the Mini App
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show the main app content
  return (
    <FarcasterContext.Provider value={{ fid, isInMiniApp }}>
      <div>{children}</div>
    </FarcasterContext.Provider>
  );
}
