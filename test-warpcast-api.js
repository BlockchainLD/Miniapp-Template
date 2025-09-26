// Test script to verify Warpcast API is working
const WARPCAST_BASE_URL = 'https://client.warpcast.com/v2';

async function testWarpcastAPI() {
  console.log('Testing Warpcast API...');
  
  try {
    // Test getting user by FID (should work)
    const response = await fetch(`${WARPCAST_BASE_URL}/user?fid=1`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Warpcast API works!');
      console.log('User data:', data.result.user.username, data.result.user.displayName);
      console.log('ETH Wallets:', data.result.user.extras?.ethWallets);
      console.log('Profile picture:', data.result.user.pfp?.url);
      
      // Test our address matching logic
      const testAddress = '0xdb83ae472F108049828dB5F429595c4B5932B62C';
      const ethWallets = data.result.user.extras?.ethWallets || [];
      const addressMatch = ethWallets.some(wallet => 
        wallet.toLowerCase() === testAddress.toLowerCase()
      );
      
      console.log('Address match test:', addressMatch ? '✅ Match found!' : '❌ No match');
      
    } else {
      console.log('❌ API failed:', response.status);
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

testWarpcastAPI();
