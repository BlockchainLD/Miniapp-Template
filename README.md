# mini-app-template

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/dylsteck/mini-app-template)

An opinionated mini app template that makes it as simple as possible to build and launch a mini app on [Base](http://base.org). Built by [dylsteck](https://github.com/dylsteck)

## Key Features
- [Convex](https://www.convex.dev) integration that gives you an all-in-one backend to add anything to your app, plus authentication with [Better Auth](https://www.better-auth.com) and [Sign In With Base](https://docs.base.org/base-account/reference/ui-elements/sign-in-with-base-button)
- [Farcaster Mini App SDK](https://miniapps.farcaster.xyz/docs/getting-started#manual-setup) support for compatibility across the [Base App](https://base.app) and [Farcaster](https://farcaster.xyz)
- **Auto-connect functionality** - Automatically connects wallet when opened in Base App or Farcaster
- **Farcaster profile integration** - Displays user profile data from Farcaster
- Built-in support for Base products like [Base Pay](https://docs.base.org/base-account/guides/accept-payments)

## Tech Stack

- **[Next.js](https://nextjs.org) + [Tailwind](https://tailwindcss.com)** app
- **[Base Account SDK](https://docs.base.org/base-account/overview/what-is-base-account)** - easy access to Base Account, Base Pay, and other tools for building on Base
- **[Convex + Better Auth](https://convex-better-auth.netlify.app)**
  - [Convex](https://www.convex.dev) is an all-in-one backend platform that handles everything from APIs to database management to file storage to realtime sync. Especially as you're trying to get a quality mini app off the ground quickly, Convex lets you add every piece you need without thinking about extra integrations. They also have a super generous free tier, which paired with Vercel deployments makes it easy for you to go from idea to production.
  - [Better Auth](https://www.better-auth.com) is a comprehensive authentication framework for TypeScript. Paired with Convex and Sign In with Base, we get a secure auth system from Sign In with Base. This template also makes use of the [Better Auth SIWE plugin](https://www.better-auth.com/docs/plugins/siwe).
- **[Farcaster Mini App SDK](https://miniapps.farcaster.xyz/docs/getting-started#manual-setup)** - using the lightweight Farcaster mini app SDK makes your mini app compatible both on the Base App and on Farcaster
- **[Worldcoin Mini Apps UI Kit](https://github.com/worldcoin/mini-apps-ui-kit)** - a sleek UI Kit from Worldcoin for building mini apps that elevates the quality of this template

## Getting Started

1. **Install dependencies**: `bun install`

2. **Set up Convex backend**: Run `bunx convex dev` to create your Convex deployment and get environment variables

3. **Create environment file**: Create `.env.local` with the following variables:
   ```bash
   # Better Auth Secret - Generate with: bunx @better-auth/cli@latest secret
   BETTER_AUTH_SECRET=your_secret_here
   
   # Site URL - Use http://localhost:3000 for local development
   SITE_URL=http://localhost:3000
   
   # Convex Environment Variables - Get these from step 2
   CONVEX_DEPLOYMENT=your_convex_deployment
   NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
   CONVEX_SITE_URL=https://your-convex-deployment.convex.cloud
   
   # Optional: World App ID for Worldcoin integration
   NEXT_PUBLIC_WORLD_APP_ID=app_123456789
   ```

4. **Configure app metadata**: Update `APP_METADATA` in `app/lib/utils.ts`:
   - `title`: Your app name
   - `description`: Your app description  
   - `imageUrl`: Your app icon URL
   - `splash.imageUrl`: Your splash screen image URL
   - `url`: Your production URL (update when deploying)
   - `baseBuilder.allowedAddresses`: Replace with your Base Account address for analytics

5. **Run locally**: `bun run dev` (starts both Next.js and Convex)

6. **Deploy to production**: Deploy to Vercel and update `SITE_URL` in your environment variables

## Features

### Auto-Connect Functionality
- **Base App**: Automatically connects wallet when opened in Base App
- **Farcaster**: Automatically connects wallet when opened in Farcaster  
- **Web**: Manual wallet connection for web browsers

### Farcaster Integration
- **Profile Data**: Displays user profile information from Farcaster
- **Avatar**: Shows user profile picture with proper image optimization
- **Social Stats**: Displays follower/following counts
- **Connected Accounts**: Shows linked social accounts

### Base Pay Integration
- **Payment Processing**: Built-in Base Pay for accepting payments
- **Wallet Integration**: Seamless wallet connection and management

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdylsteck%2Fmini-app-template)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
