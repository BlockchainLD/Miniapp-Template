// Test script to demonstrate the extended Farcaster search capabilities
const { fetchFarcasterDataByAddress, smartFarcasterSearch } = require('./app/lib/farcaster-api.ts');

async function testExtendedSearch() {
  console.log('🧪 Testing Extended Farcaster Search (FIDs 1-1500)');
  console.log('=' .repeat(60));
  
  // Test with a known address from FID #1 (Farcaster official)
  const testAddress = '0xdb83ae472F108049828dB5F429595c4B5932B62C';
  
  console.log('📍 Testing with Farcaster official address:', testAddress);
  console.log('⏳ This will search FIDs 1-1000, then fallback to 1001-1500...');
  console.log('');
  
  const startTime = Date.now();
  
  try {
    const result = await fetchFarcasterDataByAddress(testAddress);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (result) {
      console.log('✅ SUCCESS! Found user:');
      console.log('   Username:', result.username);
      console.log('   Display Name:', result.displayName);
      console.log('   FID:', result.fid);
      console.log('   Followers:', result.followers);
      console.log('   Following:', result.following);
      console.log('   Bio:', result.bio);
      console.log('   Profile Picture:', result.pfpUrl);
      console.log('   Verified Addresses:', result.verifiedAddresses);
      console.log('');
      console.log(`⏱️  Search completed in ${duration}ms`);
    } else {
      console.log('❌ No user found');
      console.log(`⏱️  Search completed in ${duration}ms`);
    }
    
  } catch (error) {
    console.error('❌ Error during search:', error);
  }
  
  console.log('');
  console.log('🔍 Search Strategy:');
  console.log('   1. Primary: FIDs 1-1000 (batch size: 10, parallel processing)');
  console.log('   2. Fallback: FIDs 1001-1500 (batch size: 5, slower but thorough)');
  console.log('   3. Caching: 5-minute cache to avoid repeated API calls');
  console.log('   4. Respectful: Delays between batches to be API-friendly');
  console.log('');
  console.log('📊 Coverage:');
  console.log('   - Early adopters (FIDs 1-100)');
  console.log('   - Popular users (FIDs 101-500)');
  console.log('   - Active community (FIDs 501-1000)');
  console.log('   - Extended range (FIDs 1001-1500)');
  console.log('');
  console.log('🎯 This should catch most Farcaster users with verified addresses!');
}

// Run the test
testExtendedSearch().catch(console.error);
