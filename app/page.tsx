"use client";

import { SimpleSignInForm } from "./components/simple-sign-in-form";
import { LoggedIn } from "./components/logged-in";
import { SafeAreaView } from "@worldcoin/mini-apps-ui-kit-react";
import { useIsMobile } from "./hooks/use-is-mobile";
import { useAccount } from "wagmi";
import { isAuthenticated } from "./lib/simple-auth";

export default function Home() {
  const isMobile = useIsMobile();
  const { isConnected, address } = useAccount();
  const authenticated = isAuthenticated();

  // Debug: Add authentication state logging
  console.log('Home component rendering, isMobile:', isMobile);
  console.log('Simple Auth - authenticated:', authenticated);
  console.log('Wagmi - isConnected:', isConnected, 'address:', address);

  const AppContent = () => {
    if (isMobile) {
      return (
        <SafeAreaView className="min-h-screen bg-white">
          {authenticated ? (
            <LoggedIn />
          ) : (
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="w-full max-w-md">
                <SimpleSignInForm />
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
              <SimpleSignInForm />
            )}
          </div>
        </div>
      </SafeAreaView>
    );
  };

  return <AppContent />;
}