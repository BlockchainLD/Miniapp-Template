// Test script to verify Neynar API key is working
const API_KEY = '2FB8077F-CB03-4299-8364-B0D703216EB6';

async function testNeynarAPI() {
  console.log('Testing Neynar API...');
  
  try {
    // Test free endpoint (should work)
    const response = await fetch('https://api.neynar.com/v2/farcaster/user/bulk?fids=1', {
      headers: {
        'api_key': API_KEY,
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Free endpoint works!');
      console.log('User data:', data.users[0].username, data.users[0].display_name);
    } else {
      console.log('❌ Free endpoint failed:', response.status);
    }
    
    // Test paid endpoint (should fail with free tier)
    const paidResponse = await fetch('https://api.neynar.com/v2/farcaster/user/bulk-by-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_key': API_KEY,
      },
      body: JSON.stringify({
        addresses: ['0x1234567890123456789012345678901234567890']
      })
    });
    
    if (paidResponse.ok) {
      console.log('✅ Paid endpoint works! (unexpected)');
    } else {
      const errorData = await paidResponse.json();
      console.log('⚠️ Paid endpoint requires upgrade:', errorData.message);
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

testNeynarAPI();
