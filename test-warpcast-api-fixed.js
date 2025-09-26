// Test script to verify Warpcast API is working with correct structure
const WARPCAST_BASE_URL = 'https://client.warpcast.com/v2';

async function testWarpcastAPI() {
  console.log('Testing Warpcast API with correct structure...');
  
  try {
    // Test getting user by FID (should work)
    const response = await fetch(`${WARPCAST_BASE_URL}/user?fid=1`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Warpcast API works!');
      console.log('User data:', data.result.user.username, data.result.user.displayName);
      
      // Check the correct location for ethWallets
      console.log('Full extras:', data.result.extras);
      console.log('ETH Wallets:', data.result.extras?.ethWallets);
      console.log('Profile picture:', data.result.user.pfp?.url);
      
      // Test our address matching logic with the correct structure
      const testAddress = '0xdb83ae472F108049828dB5F429595c4B5932B62C';
      const ethWallets = data.result.extras?.ethWallets || [];
      const addressMatch = ethWallets.some(wallet => 
        wallet.toLowerCase() === testAddress.toLowerCase()
      );
      
      console.log('Address match test:', addressMatch ? '✅ Match found!' : '❌ No match');
      console.log('Test address:', testAddress);
      console.log('Available wallets:', ethWallets);
      
    } else {
      console.log('❌ API failed:', response.status);
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

testWarpcastAPI();
