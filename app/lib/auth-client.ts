import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { siweClient } from "better-auth/client/plugins";

const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    console.log('Auth client using window.location.origin:', window.location.origin);
    return window.location.origin;
  }
  
  const fallbackUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://localhost:3000';
  console.log('Auth client using fallback URL:', fallbackUrl);
  return fallbackUrl;
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  fetchOptions: {
    credentials: 'include',
  },
  plugins: [
    convexClient(),
    siweClient(),
  ],
});
