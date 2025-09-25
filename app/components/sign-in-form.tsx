"use client";

import { useState, useEffect, useRef } from "react";
import { SignInWithBaseButton } from "@base-org/account-ui/react";
import { useAccount, useConnect, useSignMessage } from "wagmi";
import { 
  Typography, 
  Spinner
} from "@worldcoin/mini-apps-ui-kit-react";
import { useConvexAuth } from "convex/react";
import { performSiweAuth } from "../lib/siwe";
import { sdk } from '@farcaster/miniapp-sdk';

export function SignInForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAuthenticated } = useConvexAuth();
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { signMessageAsync } = useSignMessage();
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const hasAttemptedAuth = useRef(false);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Detect if we're in a Mini App
  useEffect(() => {
    const checkMiniApp = async () => {
      try {
        const isInMiniApp = await sdk.isInMiniApp();
        setIsInMiniApp(isInMiniApp);
      } catch (error) {
        console.error('Error checking Mini App status:', error);
        setIsInMiniApp(false);
      }
    };
    
    checkMiniApp();
  }, []);

  // Auto-connect when in Mini App
  useEffect(() => {
    if (isInMiniApp && !isConnected && !isLoading) {
      const autoConnect = async () => {
        try {
          setIsLoading(true);
          // Find the Farcaster connector
          const farcasterConnector = connectors.find(connector => 
            connector.type === 'farcasterMiniApp' || 
            connector.name.toLowerCase().includes('farcaster')
          );
          
          if (farcasterConnector) {
            await connectAsync({ connector: farcasterConnector });
          }
        } catch (error) {
          console.error('Auto-connect failed:', error);
          setIsLoading(false);
        }
      };
      
      autoConnect();
    }
  }, [isInMiniApp, isConnected, isLoading, connectAsync, connectors]);

  // Auto-authenticate when wallet connects but not authenticated
  useEffect(() => {
    if (isConnected && address && !isAuthenticated && !isLoading && !hasAttemptedAuth.current) {
      const autoAuthenticate = async () => {
        try {
          console.log('Auto-authenticating with address:', address);
          hasAttemptedAuth.current = true;
          setIsLoading(true);
          
          // Add timeout to prevent hanging
          const authPromise = performSiweAuth(address, signMessageAsync);
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Auto-authentication timeout')), 30000)
          );
          
          await Promise.race([authPromise, timeoutPromise]);
        } catch (error) {
          console.error('Auto-authentication failed:', error);
          hasAttemptedAuth.current = false; // Reset on failure so user can try again
          setIsLoading(false);
        }
      };
      
      autoAuthenticate();
    }
  }, [isConnected, address, isAuthenticated, isLoading, signMessageAsync]);

  // Reset auth attempt flag when authentication succeeds
  useEffect(() => {
    if (isAuthenticated) {
      hasAttemptedAuth.current = false;
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
      
      // Add timeout to prevent hanging
      const authPromise = performSiweAuth(walletAddress, signMessageAsync);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Authentication timeout')), 30000)
      );
      
      await Promise.race([authPromise, timeoutPromise]);
      
      // Don't set loading to false here - let the useEffect handle it
      // when isAuthenticated becomes true
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
               {isInMiniApp ? (
                 // Mini App users: Show auto-connect and auto-authenticate status
                 isConnected ? (
                   isAuthenticated ? (
                     <div className="text-center py-4">
                       <Typography variant="body" className="text-green-600">
                         🎉 Fully authenticated in Mini App!
                       </Typography>
                       <Typography variant="body" className="text-gray-600 mt-2">
                         Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
                       </Typography>
                     </div>
                   ) : isLoading ? (
                     <div className="flex items-center justify-center space-x-3 py-4">
                       <Spinner />
                       <Typography variant="body" className="text-gray-600">
                         {isConnected ? 'Authenticating...' : 'Connecting...'}
                       </Typography>
                     </div>
                   ) : (
                     <div className="text-center py-4 space-y-3">
                       <Typography variant="body" className="text-yellow-600">
                         ⚠️ Connected but not authenticated
                       </Typography>
                       <Typography variant="body" className="text-gray-600">
                         Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
                       </Typography>
                       <button
                         onClick={handleSiweSignIn}
                         className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                       >
                         Complete Authentication
                       </button>
                     </div>
                   )
                 ) : (
                   <div className="flex items-center justify-center space-x-3 py-4">
                     <Spinner />
                     <Typography variant="body" className="text-gray-600">
                       Auto-connecting...
                     </Typography>
                   </div>
                 )
               ) : (
          // Web users: Show Base Smart Wallet sign-in
          isLoading ? (
            <div className="flex items-center justify-center space-x-3 py-4">
              <Spinner />
              <Typography variant="body" className="text-gray-600">
                Authenticating...
              </Typography>
            </div>
          ) : (
            <SignInWithBaseButton 
              align="center"
              variant="solid"
              colorScheme="light"
              onClick={handleSiweSignIn}
            />
          )
        )}
      </div>
    </div>
  );
}
