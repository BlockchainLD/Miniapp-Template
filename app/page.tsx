"use client";

import { SignInForm } from "./components/sign-in-form";
import { LoggedIn } from "./components/logged-in";
import { AutoConnectWrapper } from "./components/auto-connect-wrapper";
import { SafeAreaView } from "@worldcoin/mini-apps-ui-kit-react";
import { useIsMobile } from "./hooks/use-is-mobile";
import { useAccount } from "wagmi";

function AppContent() {
  const isMobile = useIsMobile();
  const { isConnected } = useAccount();

  if (isMobile) {
    return (
      <SafeAreaView className="min-h-screen bg-white">
        {isConnected ? (
          <LoggedIn />
        ) : (
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md">
              <SignInForm />
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
          {isConnected ? (
            <LoggedIn />
          ) : (
            <SignInForm />
          )}
        </div>
      </div>
    </SafeAreaView>
  );
}

export default function Home() {
  return (
    <AutoConnectWrapper>
      <AppContent />
    </AutoConnectWrapper>
  );
}