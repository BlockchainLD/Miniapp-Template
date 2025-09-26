# Vercel Environment Variable Setup

## Quick Setup Instructions

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Find your project**: `mini-app-template`
3. **Click on the project**
4. **Go to Settings → Environment Variables**
5. **Add this environment variable**:
   - **Name**: `NEXT_PUBLIC_NEYNAR_API_KEY`
   - **Value**: `2FB8077F-CB03-4299-8364-B0D703216EB6`
   - **Environment**: Production
6. **Click "Save"**
7. **Redeploy**: Go to Deployments tab and click "Redeploy" on the latest deployment

## Alternative: Use Vercel CLI

If you have Vercel CLI working locally:

```bash
vercel env add NEXT_PUBLIC_NEYNAR_API_KEY production
# When prompted, enter: 2FB8077F-CB03-4299-8364-B0D703216EB6
```

## Test the API Key

Once the environment variable is set, the app will:
- ✅ Use the Neynar API key
- ⚠️ Show "API key is valid, but bulk-by-address requires paid plan" message
- 🔄 Return null for Farcaster data (since free tier doesn't support address lookup)

## Next Steps

After setting up the environment variable:
1. The app will deploy automatically
2. Test in Base App to see the API key is working
3. Consider upgrading to paid Neynar plan for full Farcaster data
