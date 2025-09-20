import { Typography } from "@worldcoin/mini-apps-ui-kit-react";
import { OpenNewWindow } from "iconoir-react";

export const HomeContent = () => {
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
};
