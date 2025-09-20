# mini-app-template

An opinionated mini app template that makes it as simple as possible to build and launch a mini app on [Base](http://base.org). Built by [dylsteck](https://github.com/dylsteck)

## Key Features
- [Convex](https://www.convex.dev) integration that gives you an all-in-one backend to add anything to your app, plus authentication with [Better Auth](https://www.better-auth.com) and [Sign In With Base](https://docs.base.org/base-account/reference/ui-elements/sign-in-with-base-button)
- [Farcaster Mini App SDK](https://miniapps.farcaster.xyz/docs/getting-started#manual-setup) support for compatibility across the [Base App](https://base.app) and [Farcaster](https://farcaster.xyz)
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

1. Install all dependencies: `bun install`

2. Create a new `.env.local` file and fill in the necessary values: `cp .env.example .env.local`
- `BETTER_AUTH_SECRET` - Generate a secret with `bunx @better-auth/cli@latest secret`
- `SITE_URL` - Keep it as `http://localhost:3000` but make sure to change to your production URL(eg. on Vercel) when you deploy
- `CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL`, and `NEXT_PUBLIC_CONVEX_SITE_URL` should be values that you get when you run `bun run convex:dev` locally

3. Fill out `APP_METADATA` in `app/lib/utils.ts`
- Most values should be straightforward(your title, app url, splash icon, etc) and aren't as necessary until you're ready to launch
- To set up `accountAssociation` once you have a mini app URL, you can go to the Preview tool on [Base.dev](https://base.dev) which lets you sign the `accountAssociation` data needed for your manifest
- For the `baseBuilder.allowedAddresses` array, replace the default `0x8342A48694A74044116F330db5050a267b28dD85` value with the Base Account address you want to use to view analytics for your mini app on Base.dev

4. Run locally with `bun run dev`, or deploy to Vercel and then test either on Base.dev or directly in the Base App.

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdylsteck%2Fmini-app-template)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
