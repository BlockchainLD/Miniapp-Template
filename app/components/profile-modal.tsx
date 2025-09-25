"use client";

import { useAccount } from "wagmi";
import { isCustomSiweAuthenticated, getCustomSiweAddress } from "../lib/custom-siwe";
import { Typography, Button } from "@worldcoin/mini-apps-ui-kit-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { address, isConnected } = useAccount();
  const isCustomAuth = isCustomSiweAuthenticated();
  // const customAddress = getCustomSiweAddress(); // Not used

  if (!isOpen || !isConnected || !address || !isCustomAuth) {
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
                Farcaster User
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
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Typography variant="body" className="text-gray-600">
                    Username:
                  </Typography>
                  <Typography variant="body" className="text-gray-900 font-medium">
                    @username
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
              }}
            >
              View Full Profile
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
