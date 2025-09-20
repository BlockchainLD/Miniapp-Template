"use client";

import { useState, useEffect } from "react";
import { SignInWithBaseButton } from "@base-org/account-ui/react";
import { useAccount, useConnect, useSignMessage } from "wagmi";
import { 
  Typography, 
  Spinner
} from "@worldcoin/mini-apps-ui-kit-react";
import { useConvexAuth } from "convex/react";
import { performSiweAuth } from "../lib/siwe";

export function SignInForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAuthenticated } = useConvexAuth();
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { signMessageAsync } = useSignMessage();

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const handleSiweSignIn = async () => {
    setIsLoading(true);
    
    try {
      let walletAddress = address;
      
      if (!isConnected || !walletAddress) {
        const result = await connectAsync({ connector: connectors[0] });
        walletAddress = result.accounts[0];
      }

      if (!walletAddress) {
        throw new Error('No wallet address found');
      }
      
      await performSiweAuth(walletAddress, signMessageAsync);
      
      window.location.reload();
    } catch (error) {
      console.error('Authentication error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-7 space-y-7">
      <div className="text-center space-y-3">
        <div className="space-y-3">
          <Typography variant="heading" className="text-gray-900">
            Mini App Template
          </Typography>
          <Typography variant="body" className="text-gray-600">
            Connect your Base Account to continue
          </Typography>
        </div>
      </div>
      <div className="space-y-4">        
        {isLoading ? (
          <div className="flex items-center justify-center space-x-3 py-4">
            <Spinner />
            <Typography variant="body" className="text-gray-600">
              Authenticating...
            </Typography>
          </div>
        ) : 
        <SignInWithBaseButton 
          align="center"
          variant="solid"
          colorScheme="light"
          onClick={handleSiweSignIn}
        />}
      </div>
    </div>
  );
}
