"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { isAuthenticated, getAuthenticatedAddress } from "../lib/simple-auth";
import { Avatar, Identity, Name, Badge } from "@coinbase/onchainkit/identity";

interface OnchainKitProfileAvatarProps {
  onProfileClick?: () => void;
}

export function OnchainKitProfileAvatar({ onProfileClick }: OnchainKitProfileAvatarProps) {
  const { address, isConnected } = useAccount();
  const [showTooltip, setShowTooltip] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  // Check authentication state
  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated();
      setAuthenticated(auth);
      console.log('OnchainKitProfileAvatar - Auth check:', { auth, isConnected, address });
    };

    // Check immediately
    checkAuth();

    // Listen for authentication events
    const handleAuthChange = () => {
      console.log('OnchainKitProfileAvatar - Auth state changed');
      checkAuth();
    };

    window.addEventListener('auth_state_changed', handleAuthChange);
    return () => window.removeEventListener('auth_state_changed', handleAuthChange);
  }, [isConnected, address]);

  // Only show if connected and authenticated
  if (!isConnected || !address || !authenticated) {
    console.log('OnchainKitProfileAvatar - Not rendering:', { isConnected, address, authenticated });
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
          </div>
        </div>
      )}
    </div>
  );
}
