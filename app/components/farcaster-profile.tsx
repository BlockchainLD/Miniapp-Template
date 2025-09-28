"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useFarcaster } from "./auto-connect-wrapper";
import { Typography, Spinner } from "@worldcoin/mini-apps-ui-kit-react";

interface FarcasterUser {
  fid: number;
  displayName: string;
  username: string;
  profile: {
    bio: {
      text: string;
    };
    location?: {
      description: string;
    };
    url?: string;
    bannerImageUrl?: string;
  };
  followerCount: number;
  followingCount: number;
  pfp: {
    url: string;
    verified: boolean;
  };
  connectedAccounts?: Array<{
    platform: string;
    username: string;
  }>;
}

interface FarcasterData {
  result: {
    user: FarcasterUser;
  };
}

export function FarcasterProfile() {
  const { fid, isInMiniApp } = useFarcaster();
  const [farcasterData, setFarcasterData] = useState<FarcasterUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarcasterData = async () => {
      if (!fid || !isInMiniApp) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/farcaster/${fid}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: FarcasterData = await response.json();
        setFarcasterData(data.result.user);
      } catch (err) {
        console.error('Error fetching Farcaster data:', err);
        setError('Failed to load Farcaster profile');
      } finally {
        setLoading(false);
      }
    };

    fetchFarcasterData();
  }, [fid, isInMiniApp]);

  if (!isInMiniApp || !fid) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4 space-y-3">
        <div className="flex items-center space-x-3">
          <Spinner />
          <Typography variant="body" className="text-gray-600">
            Loading Farcaster profile...
          </Typography>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <Typography variant="body" className="text-red-600">
          {error}
        </Typography>
      </div>
    );
  }

  if (!farcasterData) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-4 space-y-4">
      <div className="flex items-center space-x-3">
        <Image
          src={farcasterData.pfp.url}
          alt={farcasterData.displayName}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <Typography variant="heading" className="text-gray-900">
              {farcasterData.displayName}
            </Typography>
            {farcasterData.pfp.verified && (
              <span className="text-blue-500">✓</span>
            )}
          </div>
          <Typography variant="body" className="text-gray-600">
            @{farcasterData.username}
          </Typography>
        </div>
      </div>

      {farcasterData.profile.bio.text && (
        <div>
          <Typography variant="body" className="text-gray-700">
            {farcasterData.profile.bio.text}
          </Typography>
        </div>
      )}

      <div className="flex items-center space-x-4 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <span className="font-medium">{farcasterData.followerCount.toLocaleString()}</span>
          <span>followers</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="font-medium">{farcasterData.followingCount.toLocaleString()}</span>
          <span>following</span>
        </div>
      </div>

      {farcasterData.profile.location && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>📍</span>
          <span>{farcasterData.profile.location.description}</span>
        </div>
      )}

      {farcasterData.profile.url && (
        <div className="flex items-center space-x-2 text-sm">
          <span>🔗</span>
          <a 
            href={farcasterData.profile.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            {farcasterData.profile.url}
          </a>
        </div>
      )}

      {farcasterData.connectedAccounts && farcasterData.connectedAccounts.length > 0 && (
        <div className="space-y-2">
          <Typography variant="body" className="text-gray-700 font-medium">
            Connected Accounts:
          </Typography>
          <div className="space-y-1">
            {farcasterData.connectedAccounts.map((account, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="capitalize">{account.platform}:</span>
                <span>@{account.username}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
