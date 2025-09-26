"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { sdk } from '@farcaster/miniapp-sdk';
import { Avatar, Identity } from "@coinbase/onchainkit/identity";
import { isAuthenticated } from "../lib/simple-auth";

interface MiniKitProfileAvatarProps {
  onProfileClick?: () => void;
}

export function MiniKitProfileAvatar({ onProfileClick }: MiniKitProfileAvatarProps) {
  const { address, isConnected } = useAccount();
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  // Initialize Farcaster SDK and check auth
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const inMiniApp = await sdk.isInMiniApp();
        setIsInMiniApp(inMiniApp);
      } catch (error) {
        console.error('Failed to initialize Farcaster SDK:', error);
      }
    };
    
    initializeSDK();
  }, []);

  // Check authentication state
  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated();
      setAuthenticated(auth);
      console.log('MiniKitProfileAvatar - Auth check:', { 
        auth, 
        isConnected, 
        address, 
        isInMiniApp 
      });
    };

    // Check immediately
    checkAuth();

    // Listen for authentication events
    const handleAuthChange = () => {
      console.log('MiniKitProfileAvatar - Auth state changed');
      checkAuth();
    };

    window.addEventListener('auth_state_changed', handleAuthChange);
    return () => window.removeEventListener('auth_state_changed', handleAuthChange);
  }, [isConnected, address, isInMiniApp]);

  // Only show if connected and authenticated
  if (!isConnected || !address || !authenticated) {
    console.log('MiniKitProfileAvatar - Not rendering:', { isConnected, address, authenticated });
    return null;
  }

  // Schema ID for EAS attestation - this should be your app's schema
  const schemaId = "0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9";

  return (
    <div className="relative">
      <div
        className="cursor-pointer hover:scale-105 transition-transform duration-200"
        onClick={onProfileClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Identity address={address} schemaId={schemaId}>
          <Avatar className="w-10 h-10 border-2 border-white shadow-lg hover:shadow-xl transition-shadow duration-200" />
        </Identity>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-12 right-0 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg z-50 whitespace-nowrap">
          <div className="text-xs">
            Click to view profile
            {isInMiniApp && (
              <div className="text-blue-400 mt-1">✨ Mini App</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
