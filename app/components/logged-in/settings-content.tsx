import { Button, Typography, Chip } from "@worldcoin/mini-apps-ui-kit-react";
import { Copy, LogOut, CheckCircle, Wallet, Network, CreditCard, User } from "iconoir-react";
import { BasePay } from "../base-pay";

interface SettingsContentProps {
  walletAddress: string;
  copied: boolean;
  onCopyAddress: () => void;
  onSignOut: () => void;
  userId?: string;
  copiedUserId: boolean;
  onCopyUserId: () => void;
}

export const SettingsContent = ({ walletAddress, copied, onCopyAddress, onSignOut, userId, copiedUserId, onCopyUserId }: SettingsContentProps) => {
  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Typography variant="subtitle" className="text-black mb-4">
          Wallet Details
        </Typography>
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <Wallet width={20} height={20} className="text-gray-600" />
              <div className="flex-1 min-w-0">
                <Typography variant="label" className="text-black">Wallet Address</Typography>
                <div className="overflow-x-scroll scrollbar-hide">
                  <Typography variant="body" className="text-gray-600 whitespace-nowrap">
                    {walletAddress || 'Loading...'}
                  </Typography>
                </div>
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
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <User width={20} height={20} className="text-gray-600" />
              <div className="flex-1 min-w-0">
                <Typography variant="label" className="text-black">Convex User ID</Typography>
                <div className="overflow-x-scroll scrollbar-hide">
                  <Typography variant="body" className="text-gray-600 whitespace-nowrap">
                    {userId || 'Loading...'}
                  </Typography>
                </div>
              </div>
            </div>
            <button
              onClick={onCopyUserId}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {copiedUserId ? <CheckCircle width={16} height={16} /> : <Copy width={16} height={16} />}
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
            <Chip label="Chain ID: 8453" variant="important" />
          </div>
          <div className="flex items-start space-x-3">
            <CreditCard width={20} height={20} className="text-gray-600 mt-0.5" />
            <div className="flex-1">
              <Typography variant="label" className="text-black mb-3 block">Test Payment</Typography>
              <div className="mt-2">
                <BasePay />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-start space-x-3 pt-5">
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
    </div>
  );
};
