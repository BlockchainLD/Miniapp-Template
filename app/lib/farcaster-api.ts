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
    
    // Generate FIDs 1-1000 for comprehensive coverage
    // This covers early adopters, popular users, and many active community members
    const commonFids = Array.from({ length: 1000 }, (_, i) => i + 1);
    
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
    
    console.log('No matching Farcaster user found in first 1000 FIDs for address:', address);
    
    // Fallback strategy: Try some higher FIDs that are known to be active
    // This is a more targeted approach for users who might have higher FIDs
    const highFids = [
      1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010,
      1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020,
      1021, 1022, 1023, 1024, 1025, 1026, 1027, 1028, 1029, 1030,
      1031, 1032, 1033, 1034, 1035, 1036, 1037, 1038, 1039, 1040,
      1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048, 1049, 1050,
      1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060,
      1061, 1062, 1063, 1064, 1065, 1066, 1067, 1068, 1069, 1070,
      1071, 1072, 1073, 1074, 1075, 1076, 1077, 1078, 1079, 1080,
      1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088, 1089, 1090,
      1091, 1092, 1093, 1094, 1095, 1096, 1097, 1098, 1099, 1100,
      1101, 1102, 1103, 1104, 1105, 1106, 1107, 1108, 1109, 1110,
      1111, 1112, 1113, 1114, 1115, 1116, 1117, 1118, 1119, 1120,
      1121, 1122, 1123, 1124, 1125, 1126, 1127, 1128, 1129, 1130,
      1131, 1132, 1133, 1134, 1135, 1136, 1137, 1138, 1139, 1140,
      1141, 1142, 1143, 1144, 1145, 1146, 1147, 1148, 1149, 1150,
      1151, 1152, 1153, 1154, 1155, 1156, 1157, 1158, 1159, 1160,
      1161, 1162, 1163, 1164, 1165, 1166, 1167, 1168, 1169, 1170,
      1171, 1172, 1173, 1174, 1175, 1176, 1177, 1178, 1179, 1180,
      1181, 1182, 1183, 1184, 1185, 1186, 1187, 1188, 1189, 1190,
      1191, 1192, 1193, 1194, 1195, 1196, 1197, 1198, 1199, 1200,
      1201, 1202, 1203, 1204, 1205, 1206, 1207, 1208, 1209, 1210,
      1211, 1212, 1213, 1214, 1215, 1216, 1217, 1218, 1219, 1220,
      1221, 1222, 1223, 1224, 1225, 1226, 1227, 1228, 1229, 1230,
      1231, 1232, 1233, 1234, 1235, 1236, 1237, 1238, 1239, 1240,
      1241, 1242, 1243, 1244, 1245, 1246, 1247, 1248, 1249, 1250,
      1251, 1252, 1253, 1254, 1255, 1256, 1257, 1258, 1259, 1260,
      1261, 1262, 1263, 1264, 1265, 1266, 1267, 1268, 1269, 1270,
      1271, 1272, 1273, 1274, 1275, 1276, 1277, 1278, 1279, 1280,
      1281, 1282, 1283, 1284, 1285, 1286, 1287, 1288, 1289, 1290,
      1291, 1292, 1293, 1294, 1295, 1296, 1297, 1298, 1299, 1300,
      1301, 1302, 1303, 1304, 1305, 1306, 1307, 1308, 1309, 1310,
      1311, 1312, 1313, 1314, 1315, 1316, 1317, 1318, 1319, 1320,
      1321, 1322, 1323, 1324, 1325, 1326, 1327, 1328, 1329, 1330,
      1331, 1332, 1333, 1334, 1335, 1336, 1337, 1338, 1339, 1340,
      1341, 1342, 1343, 1344, 1345, 1346, 1347, 1348, 1349, 1350,
      1351, 1352, 1353, 1354, 1355, 1356, 1357, 1358, 1359, 1360,
      1361, 1362, 1363, 1364, 1365, 1366, 1367, 1368, 1369, 1370,
      1371, 1372, 1373, 1374, 1375, 1376, 1377, 1378, 1379, 1380,
      1381, 1382, 1383, 1384, 1385, 1386, 1387, 1388, 1389, 1390,
      1391, 1392, 1393, 1394, 1395, 1396, 1397, 1398, 1399, 1400,
      1401, 1402, 1403, 1404, 1405, 1406, 1407, 1408, 1409, 1410,
      1411, 1412, 1413, 1414, 1415, 1416, 1417, 1418, 1419, 1420,
      1421, 1422, 1423, 1424, 1425, 1426, 1427, 1428, 1429, 1430,
      1431, 1432, 1433, 1434, 1435, 1436, 1437, 1438, 1439, 1440,
      1441, 1442, 1443, 1444, 1445, 1446, 1447, 1448, 1449, 1450,
      1451, 1452, 1453, 1454, 1455, 1456, 1457, 1458, 1459, 1460,
      1461, 1462, 1463, 1464, 1465, 1466, 1467, 1468, 1469, 1470,
      1471, 1472, 1473, 1474, 1475, 1476, 1477, 1478, 1479, 1480,
      1481, 1482, 1483, 1484, 1485, 1486, 1487, 1488, 1489, 1490,
      1491, 1492, 1493, 1494, 1495, 1496, 1497, 1498, 1499, 1500
    ];
    
    console.log('Trying fallback strategy with higher FIDs...');
    
    // Try the higher FIDs with a smaller batch size for efficiency
    const fallbackBatchSize = 5;
    for (let i = 0; i < highFids.length; i += fallbackBatchSize) {
      const batch = highFids.slice(i, i + fallbackBatchSize);
      
      const batchPromises = batch.map(async (fid) => {
        try {
          let data = getCachedUser(fid);
          
          if (!data) {
            const response = await fetch(`${WARPCAST_BASE_URL}/user?fid=${fid}`);
            
            if (!response.ok) {
              return null;
            }
            
            const responseData = await response.json() as WarpcastResponse;
            setCachedUser(fid, responseData);
            data = responseData;
          }
          
          if (data.result?.extras?.ethWallets) {
            const ethWallets = data.result.extras.ethWallets;
            const addressMatch = ethWallets.some((wallet: string) => 
              wallet.toLowerCase() === address.toLowerCase()
            );
            
            if (addressMatch) {
              console.log('Found matching user in fallback!', data.result.user.username);
              
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
              
              return farcasterData;
            }
          }
          return null;
        } catch (error) {
          console.error(`Error checking fallback FID ${fid}:`, error);
          return null;
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      const match = batchResults.find(result => result !== null);
      if (match) {
        return match;
      }
      
      // Longer delay for fallback to be more respectful
      if (i + fallbackBatchSize < highFids.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    console.log('No matching Farcaster user found in extended search for address:', address);
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

// Smart search function that can be extended with more intelligent strategies
export const smartFarcasterSearch = async (address: string): Promise<FarcasterUserData | null> => {
  console.log('Starting smart Farcaster search for address:', address);
  
  // Strategy 1: Check if we can infer anything from the address
  // For now, we'll use the existing comprehensive search
  const result = await fetchFarcasterDataByAddress(address);
  
  if (result) {
    console.log('Smart search found user:', result.username);
    return result;
  }
  
  // Strategy 2: Could add more intelligent searches here in the future:
  // - Search by address patterns
  // - Use external APIs to find FID by address
  // - Check popular user lists
  // - Use machine learning to predict likely FID ranges
  
  console.log('Smart search completed - no user found');
  return null;
};
