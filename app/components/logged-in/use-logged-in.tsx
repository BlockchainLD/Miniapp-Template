import { useState } from "react";
import { useQuery, useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { authClient } from "../../lib/auth-client";

export const useLoggedIn = () => {
  const { isAuthenticated } = useConvexAuth();
  const currentUser = useQuery(api.auth.getCurrentUser, isAuthenticated ? {} : "skip");
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedUserId, setCopiedUserId] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("home");

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          method: 'POST',
          credentials: 'include',
        }
      });
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  const walletAddress = currentUser?.name || currentUser?.email || '';

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyUserId = async () => {
    if (currentUser?._id) {
      await navigator.clipboard.writeText(currentUser._id);
      setCopiedUserId(true);
      setTimeout(() => setCopiedUserId(false), 2000);
    }
  };

  return {
    currentUser,
    copied,
    copiedUserId,
    activeTab,
    setActiveTab,
    handleSignOut,
    walletAddress,
    handleCopyAddress,
    handleCopyUserId,
    userId: currentUser?._id,
  };
};
