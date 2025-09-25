import { SiweMessage } from "siwe";
import { base } from "viem/chains";
import { authClient } from "./auth-client";

export const performSiweAuth = async (
  walletAddress: string,
  signMessageAsync: (args: { message: string }) => Promise<string>
): Promise<void> => {
  try {
    console.log('Starting SIWE authentication for address:', walletAddress);
    
    let nonceResponse;
    try {
      console.log('Requesting nonce with:', { walletAddress, chainId: base.id });
      
      nonceResponse = await authClient.siwe.nonce({
        walletAddress,
        chainId: base.id,
      });
      
      console.log('Raw nonce response:', nonceResponse);
    } catch (nonceError) {
      console.error('Failed to get nonce:', nonceError);
      console.error('Nonce error details:', {
        message: nonceError instanceof Error ? nonceError.message : 'Unknown error',
        stack: nonceError instanceof Error ? nonceError.stack : undefined,
        error: nonceError
      });
      throw new Error(`Network error getting nonce: ${nonceError instanceof Error ? nonceError.message : 'Unknown error'}`);
    }
    
    console.log('Nonce response:', nonceResponse);
    
    if (!nonceResponse?.data?.nonce) {
      throw new Error('Failed to get nonce from server - response was empty');
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
    
    let signature;
    try {
      signature = await signMessageAsync({ message });
      console.log('Message signed, signature length:', signature.length);
    } catch (signError) {
      console.error('Failed to sign message:', signError);
      throw new Error(`Failed to sign message: ${signError instanceof Error ? signError.message : 'User rejected or error occurred'}`);
    }

    let verifyResponse;
    try {
      verifyResponse = await authClient.siwe.verify({
        message,
        signature,
        walletAddress,
        chainId: base.id,
      });
    } catch (verifyError) {
      console.error('Failed to verify signature:', verifyError);
      throw new Error(`Network error verifying signature: ${verifyError instanceof Error ? verifyError.message : 'Unknown error'}`);
    }
    
    console.log('SIWE verification response:', verifyResponse);
    
    if (!verifyResponse?.data?.success) {
      throw new Error(`SIWE verification failed: Server rejected the signature`);
    }
    
    console.log('SIWE authentication completed successfully');
  } catch (error) {
    console.error('SIWE authentication error:', error);
    throw error;
  }
};


