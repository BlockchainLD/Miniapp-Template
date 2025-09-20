"use client";

import { useState, useEffect } from "react";
import { SignInWithBaseButton } from "@base-org/account-ui/react";
import { authClient } from "@/src/lib/auth-client";
import { base } from "viem/chains";
import { useAccount, useConnect, useSignMessage, useConfig } from "wagmi";
import { SiweMessage } from "siwe";
import { 
  Typography, 
  Spinner
} from "@worldcoin/mini-apps-ui-kit-react";
import { useConvexAuth } from "convex/react";

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const { isAuthenticated } = useConvexAuth();
  const { address, isConnected } = useAccount();
  const { connectAsync } = useConnect();
  const { signMessageAsync } = useSignMessage();
  const config = useConfig();

  useEffect(() => {
    if (authSuccess && isAuthenticated) {
      setIsLoading(false);
      setAuthSuccess(false);
    }
  }, [authSuccess, isAuthenticated]);

  const handleSiweSignIn = async () => {
    setIsLoading(true);
    try {
      let walletAddress = address;
      
      if (!isConnected || !walletAddress) {
        const result = await connectAsync({
          chainId: base.id,
          connector: config.connectors[0],
        });
        walletAddress = result.accounts[0];
      }

      if (!walletAddress) {
        throw new Error('No wallet address found');
      }

      const nonceResponse = await authClient.siwe.nonce({
        walletAddress: walletAddress,
        chainId: base.id,
      });
      
      if (!nonceResponse.data?.nonce) {
        throw new Error('Failed to get nonce from Better Auth');
      }
      
      const nonce = nonceResponse.data.nonce;

      const siweMessage = new SiweMessage({
        domain: window.location.host,
        address: walletAddress,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: base.id,
        nonce: nonce,
      });

      const message = siweMessage.prepareMessage();
      const signature = await signMessageAsync({ message });

      const verifyResponse = await authClient.siwe.verify({
        message: message,
        signature: signature,
        walletAddress: walletAddress,
        chainId: base.id,
      });

      if (verifyResponse.error) {
        throw new Error(`Authentication failed: ${verifyResponse.error.message}`);
      }
      
      setAuthSuccess(true);
      
      let pollCount = 0;
      const maxPolls = 30;
      
      const pollAuthState = () => {
        pollCount++;
        
        if (isAuthenticated) {
          setIsLoading(false);
          setAuthSuccess(false);
          return;
        }
        
        if (pollCount < maxPolls) {
          setTimeout(pollAuthState, 100);
        } else {
          window.location.reload();
        }
      };
      
      pollAuthState();
    } catch (error) {
      console.error('SIWE authentication error:', error);
      setIsLoading(false);
      setAuthSuccess(false);
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
              {authSuccess ? 'Completing sign-in...' : 'Authenticating...'}
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
