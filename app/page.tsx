"use client";

import { Authenticated, Unauthenticated, AuthLoading, useConvexAuth } from "convex/react";
import { SignInForm } from "./components/sign-in-form";
import { LoggedIn } from "./components/logged-in";
import { SafeAreaView } from "@worldcoin/mini-apps-ui-kit-react";
import { useIsMobile } from "./hooks/use-is-mobile";
import { useAccount } from "wagmi";

export default function Home() {
  const isMobile = useIsMobile();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { isConnected, address } = useAccount();

  // Debug: Add authentication state logging
  console.log('Home component rendering, isMobile:', isMobile);
  console.log('Convex Auth - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);
  console.log('Wagmi - isConnected:', isConnected, 'address:', address);

  const AppContent = () => {
    if (isMobile) {
      return (
        <SafeAreaView className="min-h-screen bg-white">
          {/* Debug: Show authentication state */}
          <div className="fixed top-0 left-0 right-0 bg-yellow-200 p-2 text-xs z-50">
            <div>Convex: {isAuthenticated ? '✅' : '❌'} | Wagmi: {isConnected ? '✅' : '❌'} | Loading: {isLoading ? '⏳' : '✅'}</div>
            <div>Address: {address ? address.slice(0, 10) + '...' : 'None'}</div>
          </div>
          
          <Authenticated>
            <LoggedIn />
          </Authenticated>
          
          <Unauthenticated>
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="w-full max-w-md">
                <SignInForm />
              </div>
            </div>
          </Unauthenticated>
          
          <AuthLoading>
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-2xl p-7 space-y-7">
                  <div className="text-center space-y-3">
                    <div className="space-y-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-gray-600">Loading...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AuthLoading>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Debug: Show authentication state */}
        <div className="fixed top-0 left-0 right-0 bg-yellow-200 p-2 text-xs z-50">
          <div>Convex: {isAuthenticated ? '✅' : '❌'} | Wagmi: {isConnected ? '✅' : '❌'} | Loading: {isLoading ? '⏳' : '✅'}</div>
          <div>Address: {address ? address.slice(0, 10) + '...' : 'None'}</div>
        </div>
        
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            <Authenticated>
              <LoggedIn />
            </Authenticated>
            
            <Unauthenticated>
              <SignInForm />
            </Unauthenticated>
            
            <AuthLoading>
              <div className="bg-white rounded-3xl shadow-2xl p-7 space-y-7">
                <div className="text-center space-y-3">
                  <div className="space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600">Loading...</p>
                  </div>
                </div>
              </div>
            </AuthLoading>
          </div>
        </div>
      </SafeAreaView>
    );
  };

  return <AppContent />;
}