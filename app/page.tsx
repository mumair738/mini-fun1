"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { sdk } from '@farcaster/miniapp-sdk';
import FarcasterWalletConnect from "../components/FarcasterWalletConnect";
import styles from "./page.module.css";


export default function Home() {
  const { isFrameReady, setFrameReady } = useMiniKit();
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<{win: boolean, amount?: string, txHash?: string, remainingFlips?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  // const [userAddress, setUserAddress] = useState<string>('');
  const userAddress = ''; // Temporary placeholder - will be replaced with actual wallet address
  const [remainingFlips, setRemainingFlips] = useState<number>(2);

  // Initialize the miniapp
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
    // Trigger app display once ready
    sdk.actions.ready({ disableNativeGestures: true });
  }, [setFrameReady, isFrameReady]);

  // Update userAddress when wallet connects
  useEffect(() => {
    const handleWalletConnect = () => {
      // Get connected wallet address from wagmi
      // This will be handled by the wallet connect component
      console.log('Wallet connection state changed');
    };

    handleWalletConnect();
  }, []);

  const handleFlip = async () => {
    if (!userAddress) {
      setError('Please connect your wallet first');
      return;
    }

    setIsFlipping(true);
    setResult(null);
    setError(null);
    
    try {
      console.log('Flipping for user:', userAddress);
      
      const response = await fetch('/api/flip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userAddress }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 429) {
          setError(data.message || 'Daily limit reached');
          setRemainingFlips(data.remaining || 0);
        } else {
          setError(data.error || 'Flip failed');
        }
        return;
      }

      setResult({
        win: data.win,
        amount: data.amount,
        txHash: data.txHash,
        remainingFlips: data.remainingFlips
      });
      
      if (data.remainingFlips !== undefined) {
        setRemainingFlips(data.remainingFlips);
      }
      
    } catch (error) {
      console.error('Flip error:', error);
      setError('Network error. Please try again.');
    }
    
    setIsFlipping(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.gameTitle}>
          <div>Flip win upto 100$</div>
          {/* Next.js Image component for better performance */}
          <Image
            src="/hero.png"
            alt="Hero Image"
            width={300}
            height={200}
            style={{
              borderRadius: '12px',
              marginTop: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              maxWidth: '100%',
              height: 'auto'
            }}
          />
        </div>
        
        {/* Wallet Connect Component - Always Visible */}
        <div style={{ margin: '15px 0' }}>
          <FarcasterWalletConnect />
        </div>
        
        <div className={styles.balance}>
          Remaining Flips Today: {remainingFlips}/2
        </div>
        
        {/* Animated Meme Grid */}
        <div className={styles.memeGrid}>
          {['🐕', '🐱', '😎', '🚀', '💎', '🔥'].map((emoji, index) => (
            <div key={index} className={styles.memeCard} style={{animationDelay: `${index * 0.1}s`}}>
              {emoji}
            </div>
          ))}
        </div>
        
        <button
          onClick={handleFlip}
          disabled={isFlipping || remainingFlips === 0}
          className={styles.flipButton}
        >
          {isFlipping ? 'Flipping...' : remainingFlips === 0 ? 'Daily Limit Reached' : 'FLIP (FREE)'}
        </button>
        
        {error && (
          <div className={styles.resultBox}>
            ⚠️ {error}
          </div>
        )}
        
        {result && (
          <div className={`${styles.resultBox} ${result.win ? styles.winResult : styles.loseResult}`}>
            {result.win ? (
              <>
                🎉 You WON +{result.amount} ZORA tokens!
                {result.txHash && (
                  <div style={{fontSize: '12px', marginTop: '5px', opacity: 0.8}}>
                    TX: {result.txHash.slice(0, 10)}...
                  </div>
                )}
              </>
            ) : (
              '😢 You lost! No tokens sent. Better luck next time!'
            )}
            {result.remainingFlips !== undefined && (
              <div style={{fontSize: '12px', marginTop: '5px', opacity: 0.8}}>
                {result.remainingFlips} flips remaining today
              </div>
            )}
          </div>
        )}
        
        <div className={styles.infoText}>
          🎁 Free to play • Win 0.0001 ZORA tokens • Max 2 flips per day
        </div>
      </div>
    </div>
  );
}
