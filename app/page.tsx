"use client";

import { 
  Authenticated, 
  Unauthenticated, 
  AuthLoading
} from "convex/react";
import { SignInForm } from "./components/sign-in-form";
import { LoggedIn } from "./components/logged-in";
import { SafeAreaView } from "@worldcoin/mini-apps-ui-kit-react";

export default function Home() {
  return (
    <SafeAreaView className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <AuthLoading>
            <div className="animate-fade-in">
              <SignInForm />
            </div>
          </AuthLoading>
          
          <Unauthenticated>
            <div className="animate-fade-in">
              <SignInForm />
            </div>
          </Unauthenticated>
          
          <Authenticated>
            <div className="animate-fade-in">
              <LoggedIn />
            </div>
          </Authenticated>
        </div>
      </div>
    </SafeAreaView>
  );
}