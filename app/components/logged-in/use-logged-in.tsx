import { useState } from "react";
import { useAccount } from "wagmi";
import { signOut, getAuthenticatedAddress } from "../../lib/simple-auth";

export const useLoggedIn = () => {
  const { address } = useAccount();
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedUserId, setCopiedUserId] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("home");

  const handleSignOut = async () => {
    try {
      signOut(); // This will clear auth and reload the page
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  const walletAddress = address || getAuthenticatedAddress() || '';

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyUserId = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      setCopiedUserId(true);
      setTimeout(() => setCopiedUserId(false), 2000);
    }
  };

  return {
    copied,
    copiedUserId,
    activeTab,
    setActiveTab,
    handleSignOut,
    walletAddress,
    handleCopyAddress,
    handleCopyUserId,
    userId: walletAddress, // Use wallet address as user ID
  };
};
