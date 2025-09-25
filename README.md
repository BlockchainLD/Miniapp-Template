# Mini App Template with Auto-Connect & Profile Features

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/dylsteck/mini-app-template)

An enhanced mini app template that makes it as simple as possible to build and launch a mini app on [Base](http://base.org) with seamless authentication and profile features. Built by [dylsteck](https://github.com/dylsteck) and enhanced with auto-connect capabilities.

## ✨ Key Features

- **🔄 Auto-Connect Authentication** - Seamless wallet connection for Base App and Farcaster users
- **👤 Profile System** - Beautiful profile avatars and modals with Farcaster data integration
- **🔐 Dual Authentication Flow** - Web users (Base Smart Wallet) vs Mini App users (Auto-connect)
- **🏗️ Convex Integration** - All-in-one backend with Better Auth and SIWE authentication
- **📱 Farcaster Mini App SDK** - Full compatibility across Base App and Farcaster
- **💳 Base Pay Support** - Built-in payment processing capabilities
- **🎨 Modern UI** - Worldcoin Mini Apps UI Kit with responsive design

## 🛠️ Tech Stack

- **[Next.js](https://nextjs.org) + [Tailwind](https://tailwindcss.com)** - Modern React framework with utility-first CSS
- **[Base Account SDK](https://docs.base.org/base-account/overview/what-is-base-account)** - Easy access to Base Account, Base Pay, and Base tools
- **[Convex + Better Auth](https://convex-better-auth.netlify.app)**
  - [Convex](https://www.convex.dev) - All-in-one backend platform (APIs, database, file storage, real-time sync)
  - [Better Auth](https://www.better-auth.com) - Comprehensive TypeScript authentication framework
  - [Better Auth SIWE Plugin](https://www.better-auth.com/docs/plugins/siwe) - Sign In With Ethereum integration
- **[Farcaster Mini App SDK](https://miniapps.farcaster.xyz/docs/getting-started#manual-setup)** - Lightweight SDK for Base App and Farcaster compatibility
- **[OnchainKit Identity](https://docs.base.org/onchainkit/latest/components/identity/identity)** - Beautiful identity components for profile display
- **[Worldcoin Mini Apps UI Kit](https://github.com/worldcoin/mini-apps-ui-kit)** - Sleek UI components for mini apps

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+
- [Homebrew](https://brew.sh) (macOS) for package management
- Git for version control

### 1. Install Dependencies

```bash
# Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash

# Clone the repository
git clone <your-repo-url>
cd mini-app-template

# Install dependencies
bun install
```

### 2. Environment Setup

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Fill in the required environment variables:

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your_secret_here
SITE_URL=http://localhost:3000

# Convex Configuration (will be filled after running convex:dev)
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CONVEX_SITE_URL=

# World App ID (optional)
NEXT_PUBLIC_WORLD_APP_ID=app_123456789

# Farcaster API Configuration (for real user data)
NEXT_PUBLIC_NEYNAR_API_KEY=your_neynar_api_key_here

# OnchainKit Configuration (for MiniKit and Identity components)
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here
```

#### Generate Better Auth Secret

```bash
bunx @better-auth/cli@latest secret
```

#### Get Neynar API Key (for real Farcaster data)

1. Visit [Neynar API](https://neynar.com/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your environment variables as `NEXT_PUBLIC_NEYNAR_API_KEY`

**Note:** Without the Neynar API key, the app will use mock Farcaster data.

#### Get OnchainKit API Key (for MiniKit and Identity components)

1. Visit [OnchainKit](https://onchainkit.xyz/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your environment variables as `NEXT_PUBLIC_ONCHAINKIT_API_KEY`

**Note:** Without the OnchainKit API key, some features may not work optimally.

### 3. Convex Setup

Start Convex development server:

```bash
bun run convex:dev
```

When prompted:
- Choose "Start without an account (run Convex locally)" for development
- Copy the generated values to your `.env.local` file

### 4. Configure App Metadata

Update `app/lib/utils.ts` with your app details:

```typescript
export const APP_METADATA = {
  title: 'Your Mini App Name',
  description: 'Your app description',
  tagline: 'Your app tagline',
  imageUrl: 'https://your-image-url.com/logo.png',
  splash: {
    imageUrl: 'https://your-image-url.com/splash.png',
    backgroundColor: '#FFFFFF'
  },
  url: process.env.SITE_URL || 'http://localhost:3000',
  canonicalDomain: new URL(process.env.SITE_URL || 'http://localhost:3000').hostname,
  // ... other configuration
};
```

### 5. Run Locally

```bash
bun run dev
```

Visit `http://localhost:3000` to see your mini app!

## 🌐 Deployment

### Deploy to Vercel

1. **Connect to Vercel:**
   ```bash
   bunx vercel
   ```

2. **Deploy to Production:**
   ```bash
   bunx vercel --prod
   ```

3. **Update Environment Variables in Vercel Dashboard:**
   - Go to your Vercel project settings
   - Navigate to Environment Variables
   - Set the following variables:

   ```env
   BETTER_AUTH_SECRET=your_secret_here
   SITE_URL=https://your-vercel-app.vercel.app
   CONVEX_DEPLOYMENT=prod:your-convex-deployment
   NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
   NEXT_PUBLIC_CONVEX_SITE_URL=https://your-convex-deployment.convex.cloud
   NEXT_PUBLIC_WORLD_APP_ID=app_123456789
   NEXT_PUBLIC_NEYNAR_API_KEY=your_neynar_api_key_here
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here
   ```

4. **Update Convex Configuration:**
   - Update `convex/auth.ts` with your production URL in `trustedOrigins`
   - Update `app/lib/utils.ts` with your production URL
   - Deploy Convex changes:
     ```bash
     bunx convex deploy
     ```

### Deploy to Convex Production

```bash
# Deploy to production Convex
bunx convex deploy
```

## 🔐 Authentication Flow

This template implements a sophisticated dual authentication system:

### Web Users (Browser)
- See "Sign In with Base" button
- Uses Base Smart Wallet for authentication
- Manual sign-in flow with SIWE (Sign In With Ethereum)

### Mini App Users (Base App/Farcaster)
- Automatic wallet connection detection
- Seamless auto-connect experience
- Profile avatar appears in top-right corner
- Click avatar to view detailed profile modal

## 👤 Profile Features

### Profile Avatar
- Displays in top-right corner for connected users
- Uses OnchainKit Identity components
- Hover tooltip: "Click to view profile"
- Smooth animations and transitions

### Profile Modal
- Large avatar with verification badge
- Farcaster username with attestation
- Wallet address display
- Farcaster data (username, FID, followers, following)
- Bio section
- Action buttons for profile management

## 📁 Project Structure

```
mini-app-template/
├── app/
│   ├── components/
│   │   ├── logged-in/
│   │   │   ├── index.tsx          # Main logged-in component
│   │   │   ├── home-content.tsx   # Home page content
│   │   │   ├── settings-content.tsx # Settings page
│   │   │   └── use-logged-in.tsx  # Logged-in state management
│   │   ├── profile-avatar.tsx     # Profile avatar component
│   │   ├── profile-modal.tsx      # Profile modal component
│   │   ├── sign-in-form.tsx       # Sign-in form with auto-connect
│   │   └── base-pay.tsx          # Base Pay integration
│   ├── hooks/
│   │   └── use-is-mobile.tsx     # Mobile detection hook
│   ├── lib/
│   │   ├── auth-client.ts        # Better Auth client
│   │   ├── siwe.ts              # SIWE authentication logic
│   │   └── utils.ts             # App metadata and utilities
│   ├── providers/
│   │   ├── convex-client-provider.tsx # Convex client setup
│   │   └── wagmi-provider.tsx    # Wagmi wallet provider
│   └── page.tsx                 # Main page component
├── convex/
│   ├── auth.ts                  # Better Auth configuration
│   ├── auth.config.ts           # Auth configuration
│   ├── schema.ts               # Database schema
│   └── betterAuth/             # Better Auth Convex adapter
└── package.json
```

## 🔧 Configuration

### Base Account Setup

1. **Account Association:**
   - Visit [Base.dev Preview Tool](https://base.dev)
   - Sign the `accountAssociation` data for your manifest
   - Update the signature in `app/lib/utils.ts`

2. **Analytics Address:**
   - Replace `baseBuilder.allowedAddresses` with your Base Account address
   - This enables analytics viewing on Base.dev

### Farcaster Integration

The template automatically detects Farcaster Mini App environment and provides:
- Auto-connect functionality
- Profile data integration
- Seamless user experience

## 🧪 Testing

### Local Testing
```bash
# Start development servers
bun run dev

# Test in browser
open http://localhost:3000
```

### Production Testing
1. Deploy to Vercel
2. Test in Base App
3. Test in Farcaster
4. Verify auto-connect functionality
5. Test profile features

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Hanging:**
   - Check `trustedOrigins` in `convex/auth.ts` matches your production URL
   - Verify environment variables are set correctly in Vercel

2. **Convex Connection Issues:**
   - Ensure Convex deployment is running
   - Check `CONVEX_DEPLOYMENT` and URL variables

3. **Profile Not Loading:**
   - Verify OnchainKit Identity components are properly imported
   - Check wallet connection status

4. **Auto-Connect Not Working:**
   - Ensure Farcaster Mini App SDK is properly configured
   - Check if running in Mini App environment

### Debug Commands

```bash
# Check Convex status
bunx convex env list

# View Convex logs
bunx convex logs

# Check Vercel deployment
bunx vercel logs
```

## 📚 Resources

- [Base Documentation](https://docs.base.org)
- [Convex Documentation](https://docs.convex.dev)
- [Better Auth Documentation](https://www.better-auth.com)
- [Farcaster Mini Apps](https://miniapps.farcaster.xyz)
- [OnchainKit Documentation](https://docs.base.org/onchainkit)
- [Worldcoin Mini Apps UI Kit](https://github.com/worldcoin/mini-apps-ui-kit)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [dylsteck](https://github.com/dylsteck) for the original template
- [Base](https://base.org) for the amazing platform
- [Convex](https://convex.dev) for the backend infrastructure
- [Farcaster](https://farcaster.xyz) for the social protocol
- [Worldcoin](https://worldcoin.org) for the UI components

---

**Ready to build the future of decentralized social media on Base! 🚀**
