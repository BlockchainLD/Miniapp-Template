"use client";

import { useEffect, useState } from "react";
import { MiniKitSignInForm } from "./components/minikit-sign-in-form";
import { LoggedIn } from "./components/logged-in";
import { SafeAreaView } from "@worldcoin/mini-apps-ui-kit-react";
import { useIsMobile } from "./hooks/use-is-mobile";
import { useAccount } from "wagmi";
import { isAuthenticated } from "./lib/simple-auth";
import { sdk } from '@farcaster/miniapp-sdk';

export default function Home() {
  const isMobile = useIsMobile();
  const { isConnected, address } = useAccount();
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const authenticated = isAuthenticated();

  // Initialize Farcaster SDK
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const inMiniApp = await sdk.isInMiniApp();
        setIsInMiniApp(inMiniApp);
        
        if (inMiniApp) {
          await sdk.actions.ready();
        }
      } catch (error) {
        console.error('Failed to initialize Farcaster SDK:', error);
      }
    };
    
    initializeSDK();
  }, []);

  // Debug: Add authentication state logging
  console.log('Home component rendering, isMobile:', isMobile);
  console.log('MiniKit Auth - authenticated:', authenticated);
  console.log('Wagmi - isConnected:', isConnected, 'address:', address);
  console.log('Is in Mini App:', isInMiniApp);

  const AppContent = () => {
    if (isMobile) {
      return (
        <SafeAreaView className="min-h-screen bg-white">
          {authenticated ? (
            <LoggedIn />
          ) : (
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="w-full max-w-md">
                <MiniKitSignInForm />
              </div>
            </div>
          )}
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            {authenticated ? (
              <LoggedIn />
            ) : (
              <MiniKitSignInForm />
            )}
          </div>
        </div>
      </SafeAreaView>
    );
  };

  return <AppContent />;
}