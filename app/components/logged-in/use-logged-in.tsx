import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";

export const useLoggedIn = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedUserId, setCopiedUserId] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("home");

  const handleSignOut = async () => {
    try {
      disconnect();
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  const walletAddress = address || '';

  const handleCopyAddress = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
    userId: walletAddress, // Use wallet address as user ID for now
  };
};
