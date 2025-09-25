"use client";

import { useState, useEffect, useRef } from "react";
import { SignInWithBaseButton } from "@base-org/account-ui/react";
import { useAccount, useConnect, useSignMessage } from "wagmi";
import { 
  Typography, 
  Spinner
} from "@worldcoin/mini-apps-ui-kit-react";
import { useConvexAuth } from "convex/react";
import { performCustomSiweAuth, isCustomSiweAuthenticated } from "../lib/custom-siwe";
import { sdk } from '@farcaster/miniapp-sdk';

export function SignInForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authState, setAuthState] = useState<'idle' | 'connecting' | 'authenticating' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { isAuthenticated } = useConvexAuth();
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { signMessageAsync } = useSignMessage();
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const hasAttemptedAuth = useRef(false);
  const authTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear any existing timeouts
  useEffect(() => {
    return () => {
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
      }
    };
  }, []);

  // Reset loading state when authenticated (either Convex or custom SIWE)
  useEffect(() => {
    if (isAuthenticated || isCustomSiweAuthenticated()) {
      setIsLoading(false);
      setAuthState('success');
      hasAttemptedAuth.current = false;
    }
  }, [isAuthenticated]);

  // Listen for custom SIWE authentication events
  useEffect(() => {
    const handleSiweAuth = () => {
      console.log('Custom SIWE authentication event received');
      setIsLoading(false);
      setAuthState('success');
      hasAttemptedAuth.current = false;
    };

    window.addEventListener('siwe_authenticated', handleSiweAuth);
    return () => window.removeEventListener('siwe_authenticated', handleSiweAuth);
  }, []);

  // Detect if we're in a Mini App
  useEffect(() => {
    const checkMiniApp = async () => {
      try {
        const isInMiniApp = await sdk.isInMiniApp();
        setIsInMiniApp(isInMiniApp);
        console.log('Mini App detected:', isInMiniApp);
      } catch (error) {
        console.error('Error checking Mini App status:', error);
        setIsInMiniApp(false);
      }
    };
    
    checkMiniApp();
  }, []);

  // Single effect to handle the entire authentication flow
  useEffect(() => {
    const handleAuthentication = async () => {
      // If already authenticated, do nothing
      if (isAuthenticated) {
        return;
      }

      // If already attempting auth, do nothing
      if (hasAttemptedAuth.current || authState === 'authenticating') {
        return;
      }

      // If in Mini App and not connected, connect first
      if (isInMiniApp && !isConnected && authState === 'idle') {
        try {
          console.log('Starting auto-connect in Mini App');
          setAuthState('connecting');
          setIsLoading(true);
          
          const farcasterConnector = connectors.find(connector => 
            connector.type === 'farcasterMiniApp' || 
            connector.name.toLowerCase().includes('farcaster')
          );
          
          if (farcasterConnector) {
            await connectAsync({ connector: farcasterConnector });
          }
        } catch (error) {
          console.error('Auto-connect failed:', error);
          setAuthState('error');
          setIsLoading(false);
        }
        return;
      }

      // If connected but not authenticated, authenticate (only if not already custom authenticated)
      if (isConnected && address && !isAuthenticated && !isCustomSiweAuthenticated() && authState === 'idle') {
        try {
          console.log('Starting auto-authentication with address:', address);
          hasAttemptedAuth.current = true;
          setAuthState('authenticating');
          setIsLoading(true);
          
          // Set timeout
          authTimeoutRef.current = setTimeout(() => {
            console.error('Authentication timeout');
            setAuthState('error');
            setIsLoading(false);
            hasAttemptedAuth.current = false;
          }, 30000);
          
                 await performCustomSiweAuth(address, signMessageAsync);
          
          // Clear timeout on success
          if (authTimeoutRef.current) {
            clearTimeout(authTimeoutRef.current);
            authTimeoutRef.current = null;
          }
          
        } catch (error) {
          console.error('Auto-authentication failed:', error);
          console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            error: error
          });
          
          const errorMsg = error instanceof Error ? error.message : 'Authentication failed';
          setErrorMessage(errorMsg);
          setAuthState('error');
          setIsLoading(false);
          hasAttemptedAuth.current = false;
          
          if (authTimeoutRef.current) {
            clearTimeout(authTimeoutRef.current);
            authTimeoutRef.current = null;
          }
        }
      }
    };

    handleAuthentication();
  }, [isInMiniApp, isConnected, address, isAuthenticated, authState, connectAsync, connectors, signMessageAsync]);

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
      const authPromise = performCustomSiweAuth(walletAddress, signMessageAsync);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Authentication timeout')), 30000)
      );
      
      await Promise.race([authPromise, timeoutPromise]);

      // Don't set loading to false here - let the useEffect handle it
      // when custom SIWE authentication event is received
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
                 // Mini App users: Show detailed auth state
                 <div className="text-center py-4 space-y-3">
                   <div className="text-xs text-gray-500 mb-2">
                     State: {authState} | Connected: {isConnected ? '✅' : '❌'} | Auth: {isAuthenticated ? '✅' : '❌'}
                   </div>
                   
                   {authState === 'success' || isAuthenticated || isCustomSiweAuthenticated() ? (
                     <div>
                       <Typography variant="body" className="text-green-600">
                         🎉 Fully authenticated in Mini App!
                       </Typography>
                       <Typography variant="body" className="text-gray-600 mt-2">
                         Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
                       </Typography>
                     </div>
                   ) : authState === 'connecting' ? (
                     <div className="flex items-center justify-center space-x-3">
                       <Spinner />
                       <Typography variant="body" className="text-gray-600">
                         Connecting wallet...
                       </Typography>
                     </div>
                   ) : authState === 'authenticating' ? (
                     <div className="flex items-center justify-center space-x-3">
                       <Spinner />
                       <Typography variant="body" className="text-gray-600">
                         Authenticating...
                       </Typography>
                     </div>
                   ) : authState === 'error' ? (
                     <div className="space-y-3">
                       <Typography variant="body" className="text-red-600">
                         ❌ Authentication failed
                       </Typography>
                       {errorMessage && (
                         <div className="text-xs text-red-500 bg-red-50 p-2 rounded border">
                           Error: {errorMessage}
                         </div>
                       )}
                       <button
                         onClick={() => {
                           setAuthState('idle');
                           setErrorMessage('');
                           hasAttemptedAuth.current = false;
                         }}
                         className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                       >
                         Retry Authentication
                       </button>
                     </div>
                   ) : (
                     <div className="flex items-center justify-center space-x-3">
                       <Spinner />
                       <Typography variant="body" className="text-gray-600">
                         Initializing...
                       </Typography>
                     </div>
                   )}
                 </div>
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
