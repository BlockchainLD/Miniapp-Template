import { SiweMessage } from "siwe";
import { base } from "viem/chains";

export const performCustomSiweAuth = async (
  walletAddress: string,
  signMessageAsync: (args: { message: string }) => Promise<string>
): Promise<void> => {
  try {
    console.log('Starting custom SIWE authentication for address:', walletAddress);
    
    // Generate a simple nonce
    const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    console.log('Generated nonce:', nonce);
    
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
      nonce: nonce,
    });

    const message = siweMessage.prepareMessage();
    console.log('SIWE message prepared:', message);
    
    const signature = await signMessageAsync({ message });
    console.log('Message signed, signature length:', signature.length);

    // For now, we'll just log success - in a real implementation,
    // you would verify the signature on the server
    console.log('Custom SIWE authentication completed successfully');
    
    // Simulate successful authentication by setting a flag
    localStorage.setItem('siwe_authenticated', 'true');
    localStorage.setItem('siwe_address', walletAddress);
    localStorage.setItem('siwe_signature', signature);
    
    // Dispatch a custom event to notify components of authentication success
    window.dispatchEvent(new CustomEvent('siwe_authenticated', { 
      detail: { address: walletAddress, signature } 
    }));
    
  } catch (error) {
    console.error('Custom SIWE authentication error:', error);
    throw error;
  }
};

export const isCustomSiweAuthenticated = (): boolean => {
  return localStorage.getItem('siwe_authenticated') === 'true';
};

export const getCustomSiweAddress = (): string | null => {
  return localStorage.getItem('siwe_address');
};
