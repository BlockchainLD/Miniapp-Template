import { SiweMessage } from "siwe";
import { base } from "viem/chains";
import { authClient } from "./auth-client";

export const performSiweAuth = async (
  walletAddress: string,
  signMessageAsync: (args: { message: string }) => Promise<string>
): Promise<void> => {
  try {
    console.log('Starting SIWE authentication for address:', walletAddress);
    
    const nonceResponse = await authClient.siwe.nonce({
      walletAddress,
      chainId: base.id,
    });
    
    console.log('Nonce response:', nonceResponse);
    
    if (!nonceResponse?.data?.nonce) {
      throw new Error('Failed to get nonce from server');
    }
    
    // Use the same domain logic as the server
    const domain = process.env.NEXT_PUBLIC_SITE_URL 
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname 
      : window.location.hostname;
    
    console.log('Using domain for SIWE:', domain);
    
    const siweMessage = new SiweMessage({
      domain: domain,
      address: walletAddress,
      statement: "Sign in with Ethereum to the app.",
      uri: window.location.origin,
      version: "1",
      chainId: base.id,
      nonce: nonceResponse.data.nonce,
    });

    const message = siweMessage.prepareMessage();
    console.log('SIWE message prepared:', message);
    
    const signature = await signMessageAsync({ message });
    console.log('Message signed, signature length:', signature.length);

    const verifyResponse = await authClient.siwe.verify({
      message,
      signature,
      walletAddress,
      chainId: base.id,
    });
    
    console.log('SIWE verification response:', verifyResponse);
    
    if (!verifyResponse?.data?.success) {
      throw new Error('SIWE verification failed');
    }
    
    console.log('SIWE authentication completed successfully');
  } catch (error) {
    console.error('SIWE authentication error:', error);
    throw error;
  }
};


