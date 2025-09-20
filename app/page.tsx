"use client";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { SignInForm } from "./components/sign-in-form";
import { LoggedIn } from "./components/logged-in";
import { SafeAreaView } from "@worldcoin/mini-apps-ui-kit-react";
import { useIsMobile } from "./hooks/use-is-mobile";

export default function Home() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <SafeAreaView className="min-h-screen bg-white">
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
          <LoggedIn />
        </AuthLoading>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <Authenticated>
            <LoggedIn />
          </Authenticated>
          
          <Unauthenticated>
            <SignInForm />
          </Unauthenticated>
          
          <AuthLoading>
            <LoggedIn />
          </AuthLoading>
        </div>
      </div>
    </SafeAreaView>
  );
}