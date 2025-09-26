// Real Farcaster API integration using Warpcast API
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

// Warpcast API response types
interface WarpcastUser {
  username: string;
  displayName: string;
  followerCount: number;
  followingCount: number;
  profile: {
    bio: {
      text: string;
    };
  };
  pfp: {
    url: string;
  };
}

interface WarpcastExtras {
  ethWallets: string[];
}

interface WarpcastResponse {
  result: {
    user: WarpcastUser;
    extras: WarpcastExtras;
  };
}

// Warpcast API configuration (FREE!)
const WARPCAST_BASE_URL = 'https://client.warpcast.com/v2';

// Simple in-memory cache to avoid repeated API calls
interface CachedUser {
  data: WarpcastResponse;
  timestamp: number;
}

const userCache = new Map<string, CachedUser>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache helper functions
const getCachedUser = (fid: number): WarpcastResponse | null => {
  const cached = userCache.get(fid.toString());
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedUser = (fid: number, data: WarpcastResponse) => {
  userCache.set(fid.toString(), {
    data,
    timestamp: Date.now()
  });
};

// Fetch user data by wallet address using Warpcast API (FREE!)
// Strategy: We can't query directly by address, but we can get user data and check if the address matches
export const fetchFarcasterDataByAddress = async (address: string): Promise<FarcasterUserData | null> => {
  try {
    console.log('Fetching Farcaster data for address:', address);
    
    // Since we can't query by address directly, we'll need a different approach
    // For now, let's try some common FIDs and see if any match the wallet address
    // In a real implementation, you might want to maintain a cache or use a different strategy
    
    // Expanded FID search range for better coverage
    // These include popular users, early adopters, and active community members
    const commonFids = [
      1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
      41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
      61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
      81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100,
      // Add some higher FIDs for better coverage
      101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120,
      121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140,
      141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160,
      161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180,
      181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200
    ];
    
    // Process FIDs in batches to avoid overwhelming the API
    const batchSize = 10;
    for (let i = 0; i < commonFids.length; i += batchSize) {
      const batch = commonFids.slice(i, i + batchSize);
      
      // Process batch in parallel for better performance
      const batchPromises = batch.map(async (fid) => {
        try {
          // Check cache first
          let data = getCachedUser(fid);
          
          if (!data) {
            // Fetch from API if not in cache
            const response = await fetch(`${WARPCAST_BASE_URL}/user?fid=${fid}`);
            
            if (!response.ok) {
              return null; // Skip this FID
            }
            
            const responseData = await response.json() as WarpcastResponse;
            
            // Cache the result
            setCachedUser(fid, responseData);
            data = responseData;
          }
          
          console.log(`Checking FID ${fid}:`, data.result?.user?.username);
          
          if (data.result?.extras?.ethWallets) {
            const ethWallets = data.result.extras.ethWallets;
            
            // Check if the provided address matches any of the user's wallets
            const addressMatch = ethWallets.some((wallet: string) => 
              wallet.toLowerCase() === address.toLowerCase()
            );
            
            if (addressMatch) {
              console.log('Found matching user!', data.result.user.username);
              
              // Transform the data to our format
              const user = data.result.user;
              const farcasterData: FarcasterUserData = {
                username: user.username || 'unknown',
                fid: `#${fid}`,
                followers: user.followerCount?.toString() || '0',
                following: user.followingCount?.toString() || '0',
                bio: user.profile?.bio?.text || 'No bio available',
                displayName: user.displayName || user.username,
                pfpUrl: user.pfp?.url,
                verifiedAddresses: data.result.extras?.ethWallets || []
              };
              
              console.log('Transformed Farcaster data:', farcasterData);
              return farcasterData;
            }
          }
          return null;
        } catch (fidError) {
          console.error(`Error checking FID ${fid}:`, fidError);
          return null;
        }
      });
      
      // Wait for batch to complete
      const batchResults = await Promise.all(batchPromises);
      
      // Check if we found a match in this batch
      const match = batchResults.find(result => result !== null);
      if (match) {
        return match;
      }
      
      // Add a small delay between batches to be respectful to the API
      if (i + batchSize < commonFids.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log('No matching Farcaster user found for address:', address);
    return null;

  } catch (error) {
    console.error('Error fetching Farcaster data:', error);
    return null;
  }
};

// Alternative method: Fetch user by FID using Warpcast API (FREE!)
export const fetchFarcasterDataByFid = async (fid: string): Promise<FarcasterUserData | null> => {
  try {
    console.log('Fetching Farcaster data for FID:', fid);
    
    const fidNumber = parseInt(fid);
    
    // Check cache first
    let data = getCachedUser(fidNumber);
    
    if (!data) {
      // Fetch from API if not in cache
      const response = await fetch(`${WARPCAST_BASE_URL}/user?fid=${fid}`);

      if (!response.ok) {
        console.error('Failed to fetch user by FID:', response.status, response.statusText);
        return null;
      }

      const responseData = await response.json() as WarpcastResponse;
      
      // Cache the result
      setCachedUser(fidNumber, responseData);
      data = responseData;
    }
    console.log('User data from Warpcast by FID:', data);

    if (!data.result?.user) {
      console.log('No Farcaster user found for FID:', fid);
      return null;
    }

    const user = data.result.user;
    
    // Transform the data to our format
    const farcasterData: FarcasterUserData = {
      username: user.username || 'unknown',
      fid: `#${fid}`,
      followers: user.followerCount?.toString() || '0',
      following: user.followingCount?.toString() || '0',
      bio: user.profile?.bio?.text || 'No bio available',
      displayName: user.displayName || user.username,
      pfpUrl: user.pfp?.url,
      verifiedAddresses: data.result.extras?.ethWallets || []
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
