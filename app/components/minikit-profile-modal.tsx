"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { sdk } from '@farcaster/miniapp-sdk';
import { CustomAddress, CustomBadge } from "./custom-identity";
import { isAuthenticated, signOut } from "../lib/simple-auth";
import { fetchFarcasterDataByAddress, FarcasterUserData } from "../lib/farcaster-api";
import { Typography, Button } from "@worldcoin/mini-apps-ui-kit-react";

interface MiniKitProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MiniKitProfileModal({ isOpen, onClose }: MiniKitProfileModalProps) {
  const { address, isConnected } = useAccount();
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [farcasterData, setFarcasterData] = useState<FarcasterUserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

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
      console.log('MiniKitProfileModal - Auth check:', { 
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
      console.log('MiniKitProfileModal - Auth state changed');
      checkAuth();
    };

    window.addEventListener('auth_state_changed', handleAuthChange);
    return () => window.removeEventListener('auth_state_changed', handleAuthChange);
  }, [isConnected, address, isInMiniApp]);

  // Load real Farcaster data when modal opens
  useEffect(() => {
    if (isOpen && authenticated && address) {
      setLoading(true);
      fetchFarcasterDataByAddress(address).then((data) => {
        setFarcasterData(data);
        setIsVerified(data?.verifiedAddresses?.includes(address.toLowerCase()) || false);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Typography variant="heading" className="text-gray-900">
            Profile
            {isInMiniApp && (
              <span className="ml-2 text-blue-600 text-sm">✨ Mini App</span>
            )}
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
            {loading ? (
              <div className="w-20 h-20 border-4 border-blue-100 shadow-lg rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : farcasterData?.pfpUrl ? (
              <div className="relative">
                <img
                  src={farcasterData.pfpUrl}
                  alt={farcasterData.displayName || farcasterData.username || 'Profile'}
                  className="w-20 h-20 border-4 border-blue-100 shadow-lg rounded-full object-cover"
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-20 h-20 border-4 border-blue-100 shadow-lg rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                          ${getInitials()}
                        </div>
                      `;
                    }
                  }}
                />
                {farcasterData.verifiedAddresses?.includes(address.toLowerCase()) && (
                  <CustomBadge 
                    tooltip="Verified Farcaster User"
                    className="absolute -top-1 -right-1 w-6 h-6"
                  />
                )}
              </div>
            ) : (
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-100 shadow-lg rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                  {getInitials()}
                </div>
                {farcasterData?.verifiedAddresses?.includes(address.toLowerCase()) && (
                  <CustomBadge 
                    tooltip="Verified Farcaster User"
                    className="absolute -top-1 -right-1 w-6 h-6"
                  />
                )}
              </div>
            )}

            <div className="text-center space-y-2">
              <Typography variant="heading" className="text-xl font-semibold text-gray-900">
                {farcasterData?.displayName || farcasterData?.username || 'Unknown User'}
                {farcasterData?.verifiedAddresses?.includes(address.toLowerCase()) && (
                  <CustomBadge tooltip="Verified Farcaster User" />
                )}
              </Typography>

              <CustomAddress 
                address={address}
                className="text-sm text-gray-500 font-mono"
                isSliced={false}
              />
            </div>
          </div>

          {/* Farcaster Data Section */}
          {farcasterData && (
            <div className="bg-blue-50 rounded-2xl p-4 space-y-3">
              <Typography variant="heading" className="text-gray-900 text-lg">
                Farcaster Profile
              </Typography>
              
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

              {farcasterData.bio && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <Typography variant="body" className="text-gray-600 text-sm">
                    {farcasterData.bio}
                  </Typography>
                </div>
              )}
            </div>
          )}

          {/* Profile Details */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
              <Typography variant="heading" className="text-gray-900 text-lg">
                Wallet Information
              </Typography>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Typography variant="body" className="text-gray-600">
                    Address:
                  </Typography>
                  <Typography variant="body" className="text-gray-900 font-medium font-mono text-sm">
                    {address}
                  </Typography>
                </div>

                <div className="flex justify-between items-center">
                  <Typography variant="body" className="text-gray-600">
                    Network:
                  </Typography>
                  <Typography variant="body" className="text-gray-900 font-medium">
                    Base
                  </Typography>
                </div>

                {farcasterData?.verifiedAddresses?.includes(address.toLowerCase()) && (
                  <div className="flex justify-between items-center">
                    <Typography variant="body" className="text-gray-600">
                      Status:
                    </Typography>
                    <Typography variant="body" className="text-green-600 font-medium">
                      ✓ Verified on Farcaster
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={() => {
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
