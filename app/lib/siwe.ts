import { SiweMessage } from "siwe";
import { base } from "viem/chains";
import { authClient } from "./auth-client";

export const performSiweAuth = async (
  walletAddress: string,
  signMessageAsync: (args: { message: string }) => Promise<string>
): Promise<void> => {
  const nonceResponse = await authClient.siwe.nonce({
    walletAddress,
    chainId: base.id,
  });
  
  if (!nonceResponse?.data?.nonce) {
    throw new Error('Failed to get nonce');
  }
  
  const siweMessage = new SiweMessage({
    domain: window.location.host,
    address: walletAddress,
    statement: "Sign in with Ethereum to the app.",
    uri: window.location.origin,
    version: "1",
    chainId: base.id,
    nonce: nonceResponse.data.nonce,
  });

  const message = siweMessage.prepareMessage();
  const signature = await signMessageAsync({ message });

  await authClient.siwe.verify({
    message,
    signature,
    walletAddress,
    chainId: base.id,
  });
};


