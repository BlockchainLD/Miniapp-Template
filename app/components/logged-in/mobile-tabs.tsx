import { Typography } from "@worldcoin/mini-apps-ui-kit-react";
import { Home, Settings, Github } from "iconoir-react";

interface MobileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileTabs = ({ activeTab, onTabChange }: MobileTabsProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="flex px-2 pt-2 pb-3">
        <button
          onClick={() => onTabChange("home")}
          className={`flex-1 flex flex-col items-center justify-center py-3 transition-all duration-200 ${
            activeTab === "home" ? "text-black" : "text-gray-400"
          }`}
        >
          <Home 
            width={24} 
            height={24} 
            className={`transition-all duration-200 ${activeTab === "home" ? "text-black" : "text-gray-400"}`}
            strokeWidth={activeTab === "home" ? 2.5 : 1.5}
          />
          <Typography variant="label" className={`mt-1 font-medium text-xs transition-all duration-200 ${activeTab === "home" ? "text-black" : "text-gray-400"}`}>
            Home
          </Typography>
        </button>
        <button
          onClick={() => onTabChange("settings")}
          className={`flex-1 flex flex-col items-center justify-center py-3 transition-all duration-200 ${
            activeTab === "settings" ? "text-black" : "text-gray-400"
          }`}
        >
          <Settings 
            width={24} 
            height={24} 
            className={`transition-all duration-200 ${activeTab === "settings" ? "text-black" : "text-gray-400"}`}
            strokeWidth={activeTab === "settings" ? 2 : 1.5}
          />
          <Typography variant="label" className={`mt-1 font-medium text-xs transition-all duration-200 ${activeTab === "settings" ? "text-black" : "text-gray-400"}`}>
            Settings
          </Typography>
        </button>
        <a
          href="https://github.com/dylsteck/mini-app-template"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-3 transition-all duration-200 text-gray-400 hover:text-black"
        >
          <Github 
            width={24} 
            height={24} 
            className="transition-all duration-200"
            strokeWidth={1.5}
          />
          <Typography variant="label" className="mt-1 font-medium text-xs text-gray-400 transition-all duration-200">
            GitHub
          </Typography>
        </a>
      </div>
    </div>
  );
};
