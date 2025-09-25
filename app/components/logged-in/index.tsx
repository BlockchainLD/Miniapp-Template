import { TopBar } from "@worldcoin/mini-apps-ui-kit-react";
import { PoweredByBase } from "../powered-by-base";
import { useIsMobile } from "../../hooks/use-is-mobile";
import { HomeContent } from "./home-content";
import { SettingsContent } from "./settings-content";
import { MobileTabs } from "./mobile-tabs";
import { CopyNotification } from "./copy-notification";
import { useLoggedIn } from "./use-logged-in";
import { ProfileAvatar } from "../profile-avatar";
import { ProfileModal } from "../profile-modal";
import { useState } from "react";

export const LoggedIn = () => {
  const {
    copied,
    copiedUserId,
    activeTab,
    setActiveTab,
    handleSignOut,
    walletAddress,
    handleCopyAddress,
    handleCopyUserId,
    userId,
  } = useLoggedIn();
  
  const isMobile = useIsMobile();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        <div className="bg-white min-h-screen mb-20 flex flex-col">
          <div className="relative">
            <TopBar 
              title="Mini App Template"
              className="[&_*]:text-black"
            />
            <div className="absolute top-4 right-4 z-10">
              <ProfileAvatar onProfileClick={() => setIsProfileModalOpen(true)} />
              {/* Debug: Always show a test element */}
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-2">
                TEST
              </div>
            </div>
          </div>
          <div className="px-6 pt-0.5 pb-3">
            <PoweredByBase />
          </div>
          
          <div className="flex-1 flex items-center justify-center px-6 pb-24">
            <div className="w-full">
              {activeTab === "home" && <HomeContent />}
            {activeTab === "settings" && (
              <SettingsContent 
                walletAddress={walletAddress}
                copied={copied}
                onCopyAddress={handleCopyAddress}
                onSignOut={handleSignOut}
                userId={userId}
                copiedUserId={copiedUserId}
                onCopyUserId={handleCopyUserId}
              />
            )}
            </div>
          </div>
        </div>

        <MobileTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <CopyNotification show={copied} isMobile />
        <ProfileModal 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)} 
        />
      </>
    );
  }

  return (
    <>
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="relative">
          <TopBar 
            title="Mini App Template"
            className="[&_*]:text-black"
          />
          <div className="absolute top-4 right-4 z-10">
            <ProfileAvatar onProfileClick={() => setIsProfileModalOpen(true)} />
            {/* Debug: Always show a test element */}
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-2">
              TEST
            </div>
          </div>
        </div>
        <div className="px-6 pt-0.5 pb-3">
          <PoweredByBase />
        </div>
        <div className="p-6 pt-4">
          <SettingsContent 
            walletAddress={walletAddress}
            copied={copied}
            onCopyAddress={handleCopyAddress}
            onSignOut={handleSignOut}
            userId={userId}
            copiedUserId={copiedUserId}
            onCopyUserId={handleCopyUserId}
          />
        </div>
      </div>

      <CopyNotification show={copied} />
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
    </>
  );
};
