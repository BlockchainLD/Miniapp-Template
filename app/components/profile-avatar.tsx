"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
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
    return (
      <div className="w-10 h-10 rounded-full border-2 border-red-500 bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs">
        ?
      </div>
    );
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
