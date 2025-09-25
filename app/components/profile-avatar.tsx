"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { isCustomSiweAuthenticated, getCustomSiweAddress } from "../lib/custom-siwe";
import { Typography } from "@worldcoin/mini-apps-ui-kit-react";

interface ProfileAvatarProps {
  onProfileClick?: () => void;
}

export function ProfileAvatar({ onProfileClick }: ProfileAvatarProps) {
  const { address, isConnected } = useAccount();
  const [showTooltip, setShowTooltip] = useState(false);

  // Check both Wagmi connection and custom SIWE authentication
  const isCustomAuth = isCustomSiweAuthenticated();
  const customAddress = getCustomSiweAddress();
  
  // Debug logging
  console.log('ProfileAvatar - isConnected:', isConnected, 'address:', address);
  console.log('ProfileAvatar - isCustomAuth:', isCustomAuth, 'customAddress:', customAddress);

  if (!isConnected || !address || !isCustomAuth) {
    console.log('ProfileAvatar - Not rendering: not connected, no address, or not authenticated');
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
