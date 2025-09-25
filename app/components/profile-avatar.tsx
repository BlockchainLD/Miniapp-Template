"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Avatar, Identity } from '@coinbase/onchainkit/identity';
import { Typography } from "@worldcoin/mini-apps-ui-kit-react";

interface ProfileAvatarProps {
  onProfileClick?: () => void;
}

export function ProfileAvatar({ onProfileClick }: ProfileAvatarProps) {
  const { address, isConnected } = useAccount();
  const [showTooltip, setShowTooltip] = useState(false);

  // Debug logging
  console.log('ProfileAvatar - isConnected:', isConnected, 'address:', address);

  if (!isConnected || !address) {
    console.log('ProfileAvatar - Not rendering: not connected or no address');
    return null;
  }

  return (
    <div className="relative">
      <div 
        className="cursor-pointer hover:scale-105 transition-transform duration-200"
        onClick={onProfileClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Identity address={address}>
          <Avatar className="w-10 h-10 rounded-full border-2 border-white shadow-lg" />
        </Identity>
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
