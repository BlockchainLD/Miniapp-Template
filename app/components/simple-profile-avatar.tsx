"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { isAuthenticated, getAuthenticatedAddress } from "../lib/simple-auth";
import { Typography } from "@worldcoin/mini-apps-ui-kit-react";

interface SimpleProfileAvatarProps {
  onProfileClick?: () => void;
}

export function SimpleProfileAvatar({ onProfileClick }: SimpleProfileAvatarProps) {
  const { address, isConnected } = useAccount();
  const [showTooltip, setShowTooltip] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [authAddress, setAuthAddress] = useState<string | null>(null);

  // Check authentication state
  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated();
      const addr = getAuthenticatedAddress();
      setAuthenticated(auth);
      setAuthAddress(addr);
      console.log('SimpleProfileAvatar - Auth check:', { auth, addr, isConnected, address });
    };

    // Check immediately
    checkAuth();

    // Listen for authentication events
    const handleAuthChange = () => {
      console.log('SimpleProfileAvatar - Auth state changed');
      checkAuth();
    };

    window.addEventListener('auth_state_changed', handleAuthChange);
    return () => window.removeEventListener('auth_state_changed', handleAuthChange);
  }, [isConnected, address]);

  // Only show if connected and authenticated
  if (!isConnected || !address || !authenticated) {
    console.log('SimpleProfileAvatar - Not rendering:', { isConnected, address, authenticated });
    return null;
  }

  // Generate initials from address
  const initials = address.slice(2, 4).toUpperCase();

  return (
    <div className="relative">
      <div
        className="cursor-pointer hover:scale-105 transition-transform duration-200"
        onClick={onProfileClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Custom avatar with address initials */}
        <div className="w-10 h-10 rounded-full border-2 border-white shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
          {initials}
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-12 right-0 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg z-50 whitespace-nowrap">
          <Typography variant="body" className="text-white text-xs">
            Click to view profile
          </Typography>
        </div>
      )}
    </div>
  );
}
