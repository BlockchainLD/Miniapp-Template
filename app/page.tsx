"use client";

import { useEffect } from "react";
import { MiniKitSignInForm } from "./components/minikit-sign-in-form";
import { LoggedIn } from "./components/logged-in";
import { SafeAreaView } from "@worldcoin/mini-apps-ui-kit-react";
import { useIsMobile } from "./hooks/use-is-mobile";
import { useAccount } from "wagmi";
import { isAuthenticated } from "./lib/simple-auth";
import { useMiniKit, useIsInMiniApp } from "@coinbase/onchainkit/minikit";

export default function Home() {
  const isMobile = useIsMobile();
  const { isConnected, address } = useAccount();
  const { context, setFrameReady, isFrameReady } = useMiniKit();
  const { isInMiniApp } = useIsInMiniApp();
  const authenticated = isAuthenticated();

  // Initialize frame readiness as per documentation
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // Debug: Add authentication state logging
  console.log('Home component rendering, isMobile:', isMobile);
  console.log('MiniKit Auth - authenticated:', authenticated);
  console.log('Wagmi - isConnected:', isConnected, 'address:', address);
  console.log('MiniKit Context:', context);
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