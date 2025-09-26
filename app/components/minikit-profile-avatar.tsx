"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { sdk } from '@farcaster/miniapp-sdk';
import { isAuthenticated } from "../lib/simple-auth";
import { fetchFarcasterDataByAddress, FarcasterUserData } from "../lib/farcaster-api";
import { CustomBadge } from "./custom-identity";

interface MiniKitProfileAvatarProps {
  onProfileClick?: () => void;
}

export function MiniKitProfileAvatar({ onProfileClick }: MiniKitProfileAvatarProps) {
  const { address, isConnected } = useAccount();
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [farcasterData, setFarcasterData] = useState<FarcasterUserData | null>(null);
  const [loading, setLoading] = useState(false);

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

  // Fetch Farcaster data when authenticated
  useEffect(() => {
    if (authenticated && address && !farcasterData && !loading) {
      setLoading(true);
      fetchFarcasterDataByAddress(address).then((data) => {
        setFarcasterData(data);
        setLoading(false);
      }).catch((error) => {
        console.error('Failed to load Farcaster data for avatar:', error);
        setLoading(false);
      });
    }
  }, [authenticated, address, farcasterData, loading]);

  // Only show if connected and authenticated
  if (!isConnected || !address || !authenticated) {
    console.log('MiniKitProfileAvatar - Not rendering:', { isConnected, address, authenticated });
    return null;
  }

  // Generate initials from address or username
  const getInitials = () => {
    if (farcasterData?.displayName) {
      return farcasterData.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (farcasterData?.username) {
      return farcasterData.username.slice(0, 2).toUpperCase();
    }
    return address?.slice(2, 4).toUpperCase() || '??';
  };

  return (
    <div className="relative">
      <div
        className="cursor-pointer hover:scale-105 transition-transform duration-200"
        onClick={onProfileClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {loading ? (
          <div className="w-10 h-10 border-2 border-white shadow-lg rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : farcasterData?.pfpUrl ? (
          <div className="relative">
            <img
              src={farcasterData.pfpUrl}
              alt={farcasterData.displayName || farcasterData.username || 'Profile'}
              className="w-10 h-10 border-2 border-white shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-full object-cover"
              onError={(e) => {
                // Fallback to initials if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-10 h-10 border-2 border-white shadow-lg rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      ${getInitials()}
                    </div>
                  `;
                }
              }}
            />
            {farcasterData.verifiedAddresses?.includes(address.toLowerCase()) && (
              <CustomBadge 
                tooltip="Verified Farcaster User"
                className="absolute -top-1 -right-1 w-4 h-4"
              />
            )}
          </div>
        ) : (
          <div className="relative">
            <div className="w-10 h-10 border-2 border-white shadow-lg rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              {getInitials()}
            </div>
            {farcasterData?.verifiedAddresses?.includes(address.toLowerCase()) && (
              <CustomBadge 
                tooltip="Verified Farcaster User"
                className="absolute -top-1 -right-1 w-4 h-4"
              />
            )}
          </div>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-12 right-0 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg z-50 whitespace-nowrap">
          <div className="text-xs">
            {farcasterData ? (
              <>
                <div className="font-semibold">
                  {farcasterData.displayName || farcasterData.username || 'Unknown User'}
                </div>
                <div className="text-gray-300">
                  {farcasterData.fid}
                </div>
                <div className="text-blue-400 mt-1">
                  Click to view profile
                </div>
              </>
            ) : (
              <div>Click to view profile</div>
            )}
            {isInMiniApp && (
              <div className="text-blue-400 mt-1">✨ Mini App</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
