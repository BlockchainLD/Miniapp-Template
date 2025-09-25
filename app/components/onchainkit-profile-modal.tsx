"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { isAuthenticated, getAuthenticatedAddress, signOut } from "../lib/simple-auth";
import { Avatar, Identity, Name, Badge, Address } from "@coinbase/onchainkit/identity";
import { Typography, Button } from "@worldcoin/mini-apps-ui-kit-react";

interface OnchainKitProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnchainKitProfileModal({ isOpen, onClose }: OnchainKitProfileModalProps) {
  const { address, isConnected } = useAccount();
  const [authenticated, setAuthenticated] = useState(false);

  // Check authentication state
  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated();
      setAuthenticated(auth);
      console.log('OnchainKitProfileModal - Auth check:', { auth, isConnected, address });
    };

    // Check immediately
    checkAuth();

    // Listen for authentication events
    const handleAuthChange = () => {
      console.log('OnchainKitProfileModal - Auth state changed');
      checkAuth();
    };

    window.addEventListener('auth_state_changed', handleAuthChange);
    return () => window.removeEventListener('auth_state_changed', handleAuthChange);
  }, [isConnected, address]);

  if (!isOpen || !isConnected || !address || !authenticated) {
    return null;
  }

  // Schema ID for EAS attestation - this should be your app's schema
  const schemaId = "0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9";

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
          {/* Avatar and Name using OnchainKit Identity */}
          <div className="flex flex-col items-center space-y-4">
            <Identity address={address} schemaId={schemaId}>
              <Avatar className="w-20 h-20 border-4 border-blue-100 shadow-lg" />
            </Identity>
            
            <div className="text-center space-y-2">
              <Identity address={address} schemaId={schemaId}>
                <Name className="text-xl font-semibold text-gray-900">
                  <Badge tooltip="Verified Farcaster User" />
                </Name>
              </Identity>
              
              <Identity address={address} schemaId={schemaId}>
                <Address className="text-sm text-gray-500 font-mono" />
              </Identity>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
              <Typography variant="heading" className="text-gray-900 text-lg">
                Farcaster Data
              </Typography>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Typography variant="body" className="text-gray-600">
                    Username:
                  </Typography>
                  <Typography variant="body" className="text-gray-900 font-medium">
                    @base_builder
                  </Typography>
                </div>
                
                <div className="flex justify-between items-center">
                  <Typography variant="body" className="text-gray-600">
                    FID:
                  </Typography>
                  <Typography variant="body" className="text-gray-900 font-medium">
                    #12345
                  </Typography>
                </div>
                
                <div className="flex justify-between items-center">
                  <Typography variant="body" className="text-gray-600">
                    Followers:
                  </Typography>
                  <Typography variant="body" className="text-gray-900 font-medium">
                    1,234
                  </Typography>
                </div>
                
                <div className="flex justify-between items-center">
                  <Typography variant="body" className="text-gray-600">
                    Following:
                  </Typography>
                  <Typography variant="body" className="text-gray-900 font-medium">
                    567
                  </Typography>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <Typography variant="heading" className="text-gray-900 text-lg mb-2">
                Bio
              </Typography>
              <Typography variant="body" className="text-gray-600">
                Building the future of decentralized social media on Base! 🚀
              </Typography>
            </div>
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
