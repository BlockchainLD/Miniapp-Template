// Test script to check if we can actually fetch real Farcaster data
const { fetchFarcasterDataByAddress } = require('./app/lib/farcaster-api.ts');

async function testRealDataFetch() {
  console.log('🧪 Testing Real Farcaster Data Fetch');
  console.log('=' .repeat(50));
  
  // Test with a known Farcaster user address
  const testAddress = '0xdb83ae472F108049828dB5F429595c4B5932B62C'; // Farcaster official
  
  console.log('📍 Testing with address:', testAddress);
  console.log('⏳ This will search through FIDs 1-1500...');
  console.log('⚠️  WARNING: This will take a LONG time (several minutes)');
  console.log('');
  
  const startTime = Date.now();
  
  try {
    console.log('🚀 Starting search...');
    const result = await fetchFarcasterDataByAddress(testAddress);
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    if (result) {
      console.log('✅ SUCCESS! Found real Farcaster data:');
      console.log('   Username:', result.username);
      console.log('   Display Name:', result.displayName);
      console.log('   FID:', result.fid);
      console.log('   Followers:', result.followers);
      console.log('   Following:', result.following);
      console.log('   Bio:', result.bio);
      console.log('   Profile Picture:', result.pfpUrl);
      console.log('   Verified Addresses:', result.verifiedAddresses);
      console.log('');
      console.log(`⏱️  Search completed in ${duration.toFixed(2)} seconds`);
    } else {
      console.log('❌ No Farcaster data found');
      console.log(`⏱️  Search completed in ${duration.toFixed(2)} seconds`);
    }
    
  } catch (error) {
    console.error('❌ Error during search:', error);
  }
  
  console.log('');
  console.log('🔍 The Issue:');
  console.log('   - Warpcast API requires searching FIDs 1-1500');
  console.log('   - Each batch takes time (100ms delays)');
  console.log('   - Total time: ~2-5 minutes per search');
  console.log('   - This is too slow for real-time user experience');
  console.log('');
  console.log('💡 Solutions:');
  console.log('   1. Use Neynar API (paid, but fast)');
  console.log('   2. Cache results more aggressively');
  console.log('   3. Use a different API approach');
  console.log('   4. Show loading state while searching');
}

// Run the test
testRealDataFetch().catch(console.error);
