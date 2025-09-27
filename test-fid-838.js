// Test script specifically for FID 838
const { fetchFarcasterDataByFid } = require('./app/lib/farcaster-api.ts');

async function testFid838() {
  console.log('🧪 Testing FID 838 (Your FID)');
  console.log('=' .repeat(40));
  
  const startTime = Date.now();
  
  try {
    console.log('📍 Fetching data for FID 838...');
    const result = await fetchFarcasterDataByFid('838');
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (result) {
      console.log('✅ SUCCESS! Found your Farcaster data:');
      console.log('   Username:', result.username);
      console.log('   Display Name:', result.displayName);
      console.log('   FID:', result.fid);
      console.log('   Followers:', result.followers);
      console.log('   Following:', result.following);
      console.log('   Bio:', result.bio);
      console.log('   Profile Picture:', result.pfpUrl);
      console.log('   Verified Addresses:', result.verifiedAddresses);
      console.log('');
      console.log(`⏱️  Fetch completed in ${duration}ms`);
      
      // Check if any of the verified addresses match common wallet patterns
      if (result.verifiedAddresses && result.verifiedAddresses.length > 0) {
        console.log('🔍 Your verified wallet addresses:');
        result.verifiedAddresses.forEach((addr, index) => {
          console.log(`   ${index + 1}. ${addr}`);
        });
      }
    } else {
      console.log('❌ No data found for FID 838');
      console.log(`⏱️  Fetch completed in ${duration}ms`);
    }
    
  } catch (error) {
    console.error('❌ Error fetching FID 838:', error);
  }
  
  console.log('');
  console.log('🎯 Next Steps:');
  console.log('   1. If data was found, your wallet address should be in verifiedAddresses');
  console.log('   2. Connect with that wallet address in Base App');
  console.log('   3. The avatar should show your real Farcaster profile picture');
  console.log('   4. The profile modal should display your real Farcaster data');
}

// Run the test
testFid838().catch(console.error);
