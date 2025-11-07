"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useAccount, useDisconnect } from "wagmi";
import { useState } from "react";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [flips, setFlips] = useState(2);

  const handleFlip = () => {
    if (!isConnected) {
      alert("⚠️ Please connect your wallet first!");
      return;
    }
    if (flips <= 0) {
      alert("You’ve reached max flips for today!");
      return;
    }
    setFlips(flips - 1);
    alert("🎉 You flipped and won 0.0001 ZORA tokens!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-3xl font-bold mt-6">Flip win upto 100$</h1>

      {/* ✅ Replaced Placeholder with Dog Image */}
      <div className="bg-black rounded-xl p-4">
        <Image
          src="/dog.png"
          alt="Dog Banner"
          width={200}
          height={200}
          className="rounded-xl"
        />
      </div>

      <div className="mt-4 flex flex-col items-center gap-2 text-center">
        <div className="text-yellow-400">🪙 Connect Your Wallet</div>
        <ConnectButton />
        {isConnected && (
          <>
            <div className="text-sm mt-2">
              Connected Wallet:{" "}
              <span className="font-mono bg-gray-900 px-2 py-1 rounded">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
            <button
              onClick={() => disconnect()}
              className="text-xs underline text-gray-200 mt-1"
            >
              Disconnect
            </button>
          </>
        )}
      </div>

      <div className="text-xs opacity-80 mt-2">
        Remaining Flips Today: {flips}/2
      </div>

      {/* Flip Buttons */}
      <div className="flex gap-2 text-3xl">
        <span>🐶</span>
        <span>🚀</span>
        <span>🔥</span>
        <span>💎</span>
      </div>

      <button
        onClick={handleFlip}
        className="mt-4 bg-yellow-400 text-black font-bold px-6 py-2 rounded-xl hover:bg-yellow-300 transition-all"
      >
        FLIP (FREE)
      </button>

      <p className="text-xs opacity-70 mt-4">
        🪙 Free to play • Win 0.0001 ZORA tokens • Max 2 flips per day
      </p>
    </div>
  );
}
