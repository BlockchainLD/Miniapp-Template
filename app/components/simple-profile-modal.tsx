"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { isAuthenticated, getAuthenticatedAddress, signOut } from "../lib/simple-auth";
import { fetchFarcasterData, FarcasterUserData } from "../lib/farcaster-data";
import { Typography, Button } from "@worldcoin/mini-apps-ui-kit-react";

interface SimpleProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SimpleProfileModal({ isOpen, onClose }: SimpleProfileModalProps) {
  const { address, isConnected } = useAccount();
  const [authenticated, setAuthenticated] = useState(false);
  // const [authAddress, setAuthAddress] = useState<string | null>(null); // Not used
  const [farcasterData, setFarcasterData] = useState<FarcasterUserData | null>(null);
  const [loading, setLoading] = useState(false);

  // Check authentication state
  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated();
      const addr = getAuthenticatedAddress();
      setAuthenticated(auth);
      // setAuthAddress(addr); // Not used
      console.log('SimpleProfileModal - Auth check:', { auth, addr, isConnected, address });
    };

    // Check immediately
    checkAuth();

    // Listen for authentication events
    const handleAuthChange = () => {
      console.log('SimpleProfileModal - Auth state changed');
      checkAuth();
    };

    window.addEventListener('auth_state_changed', handleAuthChange);
    return () => window.removeEventListener('auth_state_changed', handleAuthChange);
  }, [isConnected, address]);

  // Load Farcaster data when modal opens
  useEffect(() => {
    if (isOpen && authenticated && address) {
      setLoading(true);
      fetchFarcasterData(address).then((data) => {
        setFarcasterData(data);
        setLoading(false);
      }).catch((error) => {
        console.error('Failed to load Farcaster data:', error);
        setLoading(false);
      });
    }
  }, [isOpen, authenticated, address]);

  if (!isOpen || !isConnected || !address || !authenticated) {
    return null;
  }

  // Generate initials from address
  const initials = address.slice(2, 4).toUpperCase();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Typography variant="heading" className="text-gray-900">
            Profile
          </Typography>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </Button>
        </div>

        {/* Profile Content */}
        <div className="space-y-6">
          {/* Avatar and Name */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 rounded-full border-4 border-blue-100 shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
              {initials}
            </div>
            
            <div className="text-center space-y-2">
              <Typography variant="heading" className="text-xl font-semibold text-gray-900">
                {farcasterData?.displayName || "Farcaster User"}
                <span className="ml-2 text-blue-500">✓</span>
              </Typography>
              
              <Typography variant="body" className="text-sm text-gray-500 font-mono">
                {address}
              </Typography>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
              <Typography variant="heading" className="text-gray-900 text-lg">
                Farcaster Data
              </Typography>
              
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <Typography variant="body" className="text-gray-600 ml-2">
                    Loading...
                  </Typography>
                </div>
              ) : farcasterData ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Typography variant="body" className="text-gray-600">
                      Username:
                    </Typography>
                    <Typography variant="body" className="text-gray-900 font-medium">
                      @{farcasterData.username}
                    </Typography>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Typography variant="body" className="text-gray-600">
                      FID:
                    </Typography>
                    <Typography variant="body" className="text-gray-900 font-medium">
                      {farcasterData.fid}
                    </Typography>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Typography variant="body" className="text-gray-600">
                      Followers:
                    </Typography>
                    <Typography variant="body" className="text-gray-900 font-medium">
                      {farcasterData.followers}
                    </Typography>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Typography variant="body" className="text-gray-600">
                      Following:
                    </Typography>
                    <Typography variant="body" className="text-gray-900 font-medium">
                      {farcasterData.following}
                    </Typography>
                  </div>
                </div>
              ) : (
                <Typography variant="body" className="text-gray-500">
                  No Farcaster data available
                </Typography>
              )}
            </div>

            {/* Bio */}
            {farcasterData && (
              <div className="bg-gray-50 rounded-2xl p-4">
                <Typography variant="heading" className="text-gray-900 text-lg mb-2">
                  Bio
                </Typography>
                <Typography variant="body" className="text-gray-600">
                  {farcasterData.bio}
                </Typography>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={() => {
                // TODO: Add action to view full Farcaster profile
                console.log('View full profile');
                window.open('https://warpcast.com', '_blank');
              }}
            >
              View Full Profile
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={() => {
                signOut();
                onClose();
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
