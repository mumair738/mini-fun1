"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useAccount, useDisconnect } from "wagmi";
import { useState } from "react";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [flips, setFlips] = useState(2);
  const [isFlipping, setIsFlipping] = useState(false);
  const [lastResult, setLastResult] = useState<'win' | 'lose' | null>(null);

  const handleFlip = async () => {
    if (!isConnected) {
      alert("⚠️ Please connect your wallet first!");
      return;
    }
    if (flips <= 0) {
      alert("You've reached max flips for today!");
      return;
    }
    if (isFlipping) return;

    setIsFlipping(true);
    setLastResult(null);

    // Simulate flip with animation duration
    setTimeout(() => {
      const win = Math.random() > 0.7; // 30% win rate
      setFlips(flips - 1);
      setLastResult(win ? 'win' : 'lose');
      setIsFlipping(false);
      
      if (win) {
        alert("🎉 You won 0.0001 ZORA tokens!");
      } else {
        alert("😢 Better luck next time!");
      }
    }, 1500);
  };

  const handleShareTwitter = () => {
    const tweetText = encodeURIComponent("I just won ZORA tokens on Mini-Fun! 🎉🪙 Try your luck too!");
    const url = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(url, '_blank', 'width=550,height=420');
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

      {/* Coin Flip Animation */}
      <div className="flex gap-2 text-5xl">
        <span className={isFlipping ? 'coin-flip' : ''}>
          {isFlipping ? '🪙' : lastResult === 'win' ? '🎉' : lastResult === 'lose' ? '😢' : '🪙'}
        </span>
      </div>

      {/* Emoji Row */}
      <div className="flex gap-2 text-3xl">
        <span>🐶</span>
        <span>🚀</span>
        <span>🔥</span>
        <span>💎</span>
      </div>

      <button
        onClick={handleFlip}
        disabled={isFlipping}
        className={`mt-4 bg-yellow-400 text-black font-bold px-6 py-2 rounded-xl transition-all ${
          isFlipping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-300'
        }`}
      >
        {isFlipping ? 'FLIPPING...' : 'FLIP (FREE)'}
      </button>

      {/* Twitter Share Button - Only shows after winning */}
      {lastResult === 'win' && (
        <button
          onClick={handleShareTwitter}
          className="twitter-share-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Share Win on X
        </button>
      )}

      <p className="text-xs opacity-70 mt-4">
        🪙 Free to play • Win 0.0001 ZORA tokens • Max 2 flips per day
      </p>
    </div>
  );
}
