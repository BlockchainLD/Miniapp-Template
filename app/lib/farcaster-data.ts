// Farcaster data service for fetching real user data
export interface FarcasterUserData {
  username: string;
  fid: string;
  followers: string;
  following: string;
  bio: string;
  displayName?: string;
  pfpUrl?: string;
}

// Mock Farcaster data - in a real implementation, this would fetch from Farcaster API
export const fetchFarcasterData = async (address: string): Promise<FarcasterUserData | null> => {
  try {
    console.log('Fetching Farcaster data for address:', address);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - in production, this would be a real API call
    const mockData: FarcasterUserData = {
      username: "base_builder",
      fid: "#12345",
      followers: "1,234",
      following: "567",
      bio: "Building the future of decentralized social media on Base! 🚀",
      displayName: "Base Builder",
      pfpUrl: undefined // Would be a real profile picture URL
    };
    
    console.log('Farcaster data fetched:', mockData);
    return mockData;
    
  } catch (error) {
    console.error('Error fetching Farcaster data:', error);
    return null;
  }
};

// Real Farcaster API integration (for future implementation)
export const fetchRealFarcasterData = async (address: string): Promise<FarcasterUserData | null> => {
  try {
    // This would be the real Farcaster API call
    // const response = await fetch(`https://api.farcaster.xyz/v2/user-by-address/${address}`);
    // const data = await response.json();
    // return transformFarcasterData(data);
    
    console.log('Real Farcaster API not implemented yet, using mock data');
    return await fetchFarcasterData(address);
    
  } catch (error) {
    console.error('Error fetching real Farcaster data:', error);
    return null;
  }
};

// Transform Farcaster API response to our format
const transformFarcasterData = (apiData: any): FarcasterUserData => {
  return {
    username: apiData.username || "unknown",
    fid: `#${apiData.fid || "00000"}`,
    followers: apiData.follower_count?.toString() || "0",
    following: apiData.following_count?.toString() || "0",
    bio: apiData.profile?.bio?.text || "No bio available",
    displayName: apiData.display_name || apiData.username,
    pfpUrl: apiData.pfp_url
  };
};
