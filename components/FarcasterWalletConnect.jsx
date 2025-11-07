"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSignMessage,
} from "wagmi";
import {
  RainbowKitProvider,
  ConnectButton,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { base, mainnet } from "wagmi/chains";
import { http, WagmiProvider, createConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ethers } from "ethers";

const queryClient = new QueryClient();

// ✅ wagmi config (latest v2 syntax)
const config = createConfig({
  chains: [mainnet, base],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});

// ✅ Component starts
export default function FarcasterWalletConnect() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const [verified, setVerified] = useState(false);

  async function handleVerify() {
    try {
      const message = "Sign this message to verify your wallet ownership 🪙";
      const signature = await signMessageAsync({ message });
      const recovered = ethers.utils.verifyMessage(message, signature);
      setVerified(recovered.toLowerCase() === address?.toLowerCase());
    } catch (err) {
      console.error("Verification failed", err);
      setVerified(false);
    }
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="flex flex-col items-center justify-center min-h-screen bg-[#004AAD] text-white text-center p-4">
            {/* 🐶 Wallet Header */}
            <h1 className="text-3xl font-bold mb-6">Flip & Win upto 100$</h1>

            <div className="bg-black rounded-xl p-4 mb-6 shadow-lg">
              <Image
                src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
                alt="Dog Logo"
                width={160}
                height={160}
                className="rounded-xl"
              />
            </div>

            {/* 🪙 Wallet Connect Section */}
            <div className="flex flex-col gap-3 items-center">
              <span className="text-yellow-400 font-medium">
                🪙 Connect Your Wallet
              </span>

              <ConnectButton chainStatus="none" showBalance={false} />

              {isConnected && (
                <>
                  <p className="text-sm mt-2">
                    Connected Wallet:{" "}
                    <span className="font-mono bg-gray-900 px-2 py-1 rounded">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                  </p>

                  <button
                    onClick={disconnect}
                    className="text-xs text-gray-300 underline mt-1"
                  >
                    Disconnect
                  </button>

                  <button
                    onClick={handleVerify}
                    className="bg-yellow-400 text-black font-bold px-4 py-2 rounded-xl hover:bg-yellow-300 transition-all mt-3"
                  >
                    🔐 Sign & Verify
                  </button>

                  <div className="mt-2 text-sm">
                    {verified ? (
                      <span className="text-green-400">✅ Wallet Verified</span>
                    ) : (
                      <span className="text-red-400">❌ Not Verified</span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* 🧠 Footer */}
            <p className="mt-6 text-xs opacity-70">
              🪙 Free to play • Max 2 flips/day • Secure Farcaster wallet
            </p>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}