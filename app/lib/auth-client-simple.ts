import { createAuthClient } from "better-auth/react";
import { siweClient } from "better-auth/client/plugins";

const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  return process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://localhost:3000';
};

// Simplified auth client without Convex for testing
export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  fetchOptions: {
    credentials: 'include',
  },
  plugins: [
    siweClient(),
  ],
});
