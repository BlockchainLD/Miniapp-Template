// Real Farcaster API integration using Neynar API
export interface FarcasterUserData {
  username: string;
  fid: string;
  followers: string;
  following: string;
  bio: string;
  displayName?: string;
  pfpUrl?: string;
  verifiedAddresses?: string[];
}

// Neynar API configuration
const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;
const NEYNAR_BASE_URL = 'https://api.neynar.com/v2';

// Fetch user data by wallet address using Neynar API
export const fetchFarcasterDataByAddress = async (address: string): Promise<FarcasterUserData | null> => {
  try {
    console.log('Fetching Farcaster data for address:', address);
    
    if (!NEYNAR_API_KEY) {
      console.error('Neynar API key not found - cannot fetch Farcaster data');
      return null;
    }

    // First, get user by wallet address
    const userResponse = await fetch(`${NEYNAR_BASE_URL}/farcaster/user/bulk-by-address`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_key': NEYNAR_API_KEY,
      },
      body: JSON.stringify({
        addresses: [address]
      })
    });

    if (!userResponse.ok) {
      console.error('Failed to fetch user by address:', userResponse.status, userResponse.statusText);
      return null;
    }

    const userData = await userResponse.json();
    console.log('User data from Neynar:', userData);

    if (!userData.users || userData.users.length === 0) {
      console.log('No Farcaster user found for address:', address);
      return null;
    }

    const user = userData.users[0];
    
    // Get additional user stats
    const statsResponse = await fetch(`${NEYNAR_BASE_URL}/farcaster/user/bulk?fids=${user.fid}`, {
      headers: {
        'api_key': NEYNAR_API_KEY,
      }
    });

    let stats = null;
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      stats = statsData.users?.[0];
    }

    // Transform the data to our format
    const farcasterData: FarcasterUserData = {
      username: user.username || 'unknown',
      fid: `#${user.fid}`,
      followers: stats?.follower_count?.toString() || '0',
      following: stats?.following_count?.toString() || '0',
      bio: user.profile?.bio?.text || 'No bio available',
      displayName: user.display_name || user.username,
      pfpUrl: user.pfp_url,
      verifiedAddresses: user.verified_addresses?.eth_addresses || []
    };

    console.log('Transformed Farcaster data:', farcasterData);
    return farcasterData;

  } catch (error) {
    console.error('Error fetching Farcaster data:', error);
    return null;
  }
};

// Alternative method: Fetch user by FID if we have it
export const fetchFarcasterDataByFid = async (fid: string): Promise<FarcasterUserData | null> => {
  try {
    console.log('Fetching Farcaster data for FID:', fid);
    
    if (!NEYNAR_API_KEY) {
      console.error('Neynar API key not found - cannot fetch Farcaster data');
      return null;
    }

    const response = await fetch(`${NEYNAR_BASE_URL}/farcaster/user/bulk?fids=${fid}`, {
      headers: {
        'api_key': NEYNAR_API_KEY,
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch user by FID:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    console.log('User data from Neynar by FID:', data);

    if (!data.users || data.users.length === 0) {
      console.log('No Farcaster user found for FID:', fid);
      return null;
    }

    const user = data.users[0];
    
    // Transform the data to our format
    const farcasterData: FarcasterUserData = {
      username: user.username || 'unknown',
      fid: `#${user.fid}`,
      followers: user.follower_count?.toString() || '0',
      following: user.following_count?.toString() || '0',
      bio: user.profile?.bio?.text || 'No bio available',
      displayName: user.display_name || user.username,
      pfpUrl: user.pfp_url,
      verifiedAddresses: user.verified_addresses?.eth_addresses || []
    };

    console.log('Transformed Farcaster data by FID:', farcasterData);
    return farcasterData;

  } catch (error) {
    console.error('Error fetching Farcaster data by FID:', error);
    return null;
  }
};

// Neynar API is ready to use - just need the API key

// Check if a wallet address is verified on Farcaster
export const isWalletVerifiedOnFarcaster = async (address: string): Promise<boolean> => {
  try {
    const userData = await fetchFarcasterDataByAddress(address);
    return userData?.verifiedAddresses?.includes(address.toLowerCase()) || false;
  } catch (error) {
    console.error('Error checking wallet verification:', error);
    return false;
  }
};
