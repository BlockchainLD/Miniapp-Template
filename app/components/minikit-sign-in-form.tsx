"use client";

import { useState, useEffect } from "react";
import { useMiniKit, useAuthenticate, useIsInMiniApp } from "@coinbase/onchainkit/minikit";
import { SignInWithBaseButton } from "@base-org/account-ui/react";
import { useAccount, useConnect } from "wagmi";
import { Typography, Spinner } from "@worldcoin/mini-apps-ui-kit-react";
import { setAuthenticated, isAuthenticated } from "../lib/simple-auth";

export function MiniKitSignInForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authState, setAuthState] = useState<'idle' | 'connecting' | 'authenticating' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // MiniKit hooks
  const { context, isFrameReady, setFrameReady } = useMiniKit();
  const { signIn } = useAuthenticate();
  const { isInMiniApp } = useIsInMiniApp();
  
  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();

  // Signal frame readiness when component mounts
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // Check if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      setAuthState('success');
    }
  }, []);

  // Auto-connect for Mini App users
  useEffect(() => {
    const handleAutoConnect = async () => {
      if (isInMiniApp && !isConnected && authState === 'idle' && !isAuthenticated()) {
        try {
          console.log('Starting auto-connect in Mini App via MiniKit');
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
          setErrorMessage('Auto-connect failed');
          setIsLoading(false);
        }
      }
    };

    handleAutoConnect();
  }, [isInMiniApp, isConnected, authState, connectAsync, connectors]);

  // Auto-authenticate when connected using MiniKit
  useEffect(() => {
    const handleAutoAuth = async () => {
      if (isConnected && address && !isAuthenticated() && authState === 'idle') {
        try {
          console.log('Starting MiniKit authentication with address:', address);
          setAuthState('authenticating');
          setIsLoading(true);
          
          // Use MiniKit authentication
          const authResult = await signIn();
          
          if (authResult) {
            // Also set our simple auth for compatibility
            setAuthenticated(address);
            setAuthState('success');
            setIsLoading(false);
          } else {
            throw new Error('Authentication failed');
          }
          
        } catch (error) {
          console.error('MiniKit authentication failed:', error);
          setAuthState('error');
          setErrorMessage(error instanceof Error ? error.message : 'Authentication failed');
          setIsLoading(false);
        }
      }
    };

    handleAutoAuth();
  }, [isConnected, address, authState, signIn]);

  const handleManualSignIn = async () => {
    setIsLoading(true);
    setAuthState('authenticating');

    try {
      let walletAddress = address;

      if (!isConnected || !walletAddress) {
        const result = await connectAsync({ connector: connectors[0] });
        walletAddress = result.accounts[0];
      }

      if (!walletAddress) {
        throw new Error('No wallet address found');
      }

      // Use MiniKit authentication
      const authResult = await signIn();
      
      if (authResult) {
        setAuthenticated(walletAddress);
        setAuthState('success');
        setIsLoading(false);
      } else {
        throw new Error('Authentication failed');
      }

    } catch (error) {
      console.error('Authentication error:', error);
      setAuthState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Authentication failed');
      setIsLoading(false);
    }
  };

  // Show success state
  if (authState === 'success' || isAuthenticated()) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-7 space-y-7">
        <div className="text-center space-y-3">
          <div className="space-y-3">
            <Typography variant="heading" className="text-gray-900">
              🎉 Welcome!
            </Typography>
            <Typography variant="body" className="text-gray-600">
              You&apos;re successfully authenticated via MiniKit
            </Typography>
            <Typography variant="body" className="text-gray-500 text-sm font-mono">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </Typography>
            {isInMiniApp && (
              <Typography variant="body" className="text-blue-600 text-xs">
                ✨ Mini App Mode Active
              </Typography>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-7 space-y-7">
      <div className="text-center space-y-3">
        <div className="space-y-3">
          <Typography variant="heading" className="text-gray-900">
            Mini App Template
          </Typography>
          <Typography variant="body" className="text-gray-600">
            Connect your wallet to continue
          </Typography>
          {isInMiniApp && (
            <Typography variant="body" className="text-blue-600 text-xs">
              🚀 Mini App Environment Detected
            </Typography>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        {isInMiniApp ? (
          // Mini App users: Show detailed auth state
          <div className="text-center py-4 space-y-3">
            <div className="text-xs text-gray-500 mb-2">
              State: {authState} | Connected: {isConnected ? '✅' : '❌'} | Auth: {isAuthenticated() ? '✅' : '❌'}
            </div>

            {authState === 'connecting' ? (
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
                  Authenticating via MiniKit...
                </Typography>
              </div>
            ) : authState === 'error' ? (
              <div className="space-y-3">
                <Typography variant="body" className="text-red-600">
                  ❌ {errorMessage}
                </Typography>
                <button
                  onClick={() => {
                    setAuthState('idle');
                    setErrorMessage('');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-3">
                <Spinner />
                <Typography variant="body" className="text-gray-600">
                  Initializing MiniKit...
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
              onClick={handleManualSignIn}
            />
          )
        )}
      </div>
    </div>
  );
}
