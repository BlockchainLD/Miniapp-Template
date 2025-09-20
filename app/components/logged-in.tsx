"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { authClient } from "@/src/lib/auth-client";
import { 
  TopBar,
  Button,
  Typography,
  Tabs
} from "@worldcoin/mini-apps-ui-kit-react";
import { 
  Copy, 
  LogOut, 
  CheckCircle, 
  Wallet,
  Network,
  Home,
  Settings,
  OpenNewWindow,
  Github
} from "iconoir-react";
import { useState } from "react";
import { PoweredByBase } from "./powered-by-base";
import { useIsMobile } from "../hooks/use-is-mobile";
import { BasePay } from "./base-pay";

function HomeContent() {
  return (
    <div className="space-y-6">
      <div className="text-left space-y-3">
        <Typography variant="body" className="text-gray-600">
          Get started with these quick steps
        </Typography>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 rounded-lg p-4 space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div className="flex-1">
              <Typography variant="label" className="text-black">Check your .env.local</Typography>
              <Typography variant="body" className="text-gray-600">Configure your env variables</Typography>
            </div>
          </div>
        </div>

        <a 
          href="https://dashboard.convex.dev" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block"
        >
          <div className="bg-green-50 rounded-lg p-4 space-y-3 hover:bg-green-100 transition-colors cursor-pointer">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <Typography variant="label" className="text-black">Check users on Convex</Typography>
                  <Typography variant="body" className="text-gray-600">View your dashboard</Typography>
                </div>
                <OpenNewWindow width={16} height={16} className="text-green-500" />
              </div>
            </div>
          </div>
        </a>

        <a 
          href="https://docs.base.org/mini-apps" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block"
        >
          <div className="bg-purple-50 rounded-lg p-4 space-y-3 hover:bg-purple-100 transition-colors cursor-pointer">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <Typography variant="label" className="text-black">Go to Base docs</Typography>
                  <Typography variant="body" className="text-gray-600">Learn more about Base</Typography>
                </div>
                <OpenNewWindow width={16} height={16} className="text-purple-500" />
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}

interface SettingsContentProps {
  shortAddress: string;
  copied: boolean;
  onCopyAddress: () => void;
  onSignOut: () => void;
}

function SettingsContent({ shortAddress, copied, onCopyAddress, onSignOut }: SettingsContentProps) {
  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Typography variant="subtitle" className="text-black mb-4">
          Wallet Details
        </Typography>
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wallet width={20} height={20} className="text-gray-600" />
              <div>
                <Typography variant="label" className="text-black">Wallet Address</Typography>
                <Typography variant="body" className="text-gray-600">{shortAddress}</Typography>
              </div>
            </div>
            <button
              onClick={onCopyAddress}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {copied ? <CheckCircle width={16} height={16} /> : <Copy width={16} height={16} />}
            </button>
          </div>   
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Network width={20} height={20} className="text-gray-600" />
              <div>
                <Typography variant="label" className="text-black">Network</Typography>
                <Typography variant="body" className="text-gray-600">Base Mainnet</Typography>
              </div>
            </div>
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
              Chain ID: 8453
            </div>
          </div>
        </div>
        <Typography variant="subtitle" className="text-black mb-4">
          Donate
        </Typography>
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
          <BasePay />
          </div>   
        </div>
      </div>
      <div className="space-y-4 pt-2">
        <Button
          variant="secondary"
          fullWidth
          onClick={onSignOut}
          className="!bg-red-500 !text-white hover:!bg-red-600 flex items-center justify-center space-x-2"
        >
          <LogOut width={20} height={20} />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
}

export function LoggedIn() {
  const currentUser = useQuery(api.auth.getCurrentUser);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("home");
  const isMobile = useIsMobile();

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
  const shortAddress = walletAddress.length > 10 
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : walletAddress;

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isMobile) {
    return (
      <>
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-20">
          <TopBar 
            title="Mini App Template"
            className="[&_*]:text-black"
          />
          <div className="px-6 pt-0.5 pb-3">
            <PoweredByBase />
          </div>
          
          <div className="p-6">
            {activeTab === "home" && (
              <HomeContent />
            )}
            {activeTab === "settings" && (
              <SettingsContent 
                shortAddress={shortAddress}
                copied={copied}
                onCopyAddress={handleCopyAddress}
                onSignOut={handleSignOut}
              />
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="py-1 fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
            <div className="flex">
              <button
                onClick={() => setActiveTab("home")}
                className={`flex-1 flex flex-col items-center justify-center py-4 transition-colors ${
                  activeTab === "home" ? "text-black" : "text-gray-400"
                }`}
              >
                <Home 
                  width={24} 
                  height={24} 
                  className={activeTab === "home" ? "text-black" : "text-gray-400"}
                  strokeWidth={activeTab === "home" ? 2.5 : 1.5}
                />
                <Typography variant="label" className={`mt-1 font-medium text-xs ${activeTab === "home" ? "text-black" : "text-gray-400"}`}>
                  Home
                </Typography>
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex-1 flex flex-col items-center justify-center py-4 transition-colors ${
                  activeTab === "settings" ? "text-black" : "text-gray-400"
                }`}
              >
                <Settings 
                  width={24} 
                  height={24} 
                  className={activeTab === "settings" ? "text-black" : "text-gray-400"}
                  strokeWidth={activeTab === "settings" ? 2 : 1.5}
                />
                <Typography variant="label" className={`mt-1 font-medium text-xs ${activeTab === "settings" ? "text-black" : "text-gray-400"}`}>
                  Settings
                </Typography>
              </button>
              <a
                href="https://github.com/dylsteck/mini-app-template"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex flex-col items-center justify-center py-4 transition-colors text-gray-400 hover:text-black"
              >
                <Github 
                  width={24} 
                  height={24} 
                  strokeWidth={1.5}
                />
                <Typography variant="label" className="mt-1 font-medium text-xs text-gray-400">
                  GitHub
                </Typography>
              </a>
            </div>
          </div>
        </Tabs>

        {copied && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
            <Typography variant="label" className="text-white">Copied!</Typography>
            <Typography variant="body" className="text-white">Wallet address copied to clipboard</Typography>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <TopBar 
          title="Mini App Template"
          className="[&_*]:text-black"
        />
        <div className="px-6 pt-0.5 pb-3">
          <PoweredByBase />
        </div>
        <div className="p-6 pt-4">
          <SettingsContent 
            shortAddress={shortAddress}
            copied={copied}
            onCopyAddress={handleCopyAddress}
            onSignOut={handleSignOut}
          />
        </div>
      </div>

      {copied && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <Typography variant="label" className="text-white">Copied!</Typography>
          <Typography variant="body" className="text-white">Wallet address copied to clipboard</Typography>
        </div>
      )}
    </>
  );
}
