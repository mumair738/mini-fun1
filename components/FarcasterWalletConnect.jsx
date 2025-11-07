"use client";
import React from "react";
import Image from "next/image";
import {
  WagmiProvider,
  createConfig,
  http,
  useAccount,
  useConnect,
  useDisconnect,
} from "wagmi";
import { mainnet, base, polygon } from "wagmi/chains";
import { coinbaseWallet, metaMask, walletConnect } from "wagmi/connectors";
import { ethers } from "ethers";

// wagmi config (v2 syntax)
const config = createConfig({
  chains: [mainnet, base, polygon],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [polygon.id]: http(),
  },
  connectors: [
    metaMask(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo",
    }),
    coinbaseWallet({ appName: "Mini Fun Flip" }),
  ],
});

// Small helper to shorten address
function shortAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Main UI component
export default function FarcasterWalletConnect() {
  return (
    <WagmiProvider config={config}>
      <div className="wallet-connect-container">
        <h2 className="wallet-connect-title">🪙 Connect Your Wallet</h2>
        <ConnectButtons />
      </div>
    </WagmiProvider>
  );
}

function ConnectButtons() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, status } = useConnect();
  const { disconnect } = useDisconnect();

  async function handleSignIn() {
    // Example: request user to sign a message for authentication
    if (!address || !window.ethereum) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const message = `Sign this message to authenticate with Mini Fun Flip. Nonce: ${Date.now()}`;
      const signature = await signer.signMessage(message);
      // Send 'address' and 'signature' to your backend to verify and create a session
      console.log("Signed message:", signature);
      console.log("Address:", address);
      alert("Message signed successfully! Check console for details (send to backend to verify).");
    } catch (e) {
      console.error(e);
      alert("Signing failed: " + (e?.message || e));
    }
  }

  if (isConnected && address) {
    return (
      <div className="connected-wallet">
        <div className="wallet-info">
          <div className="wallet-label">Connected Wallet</div>
          <div className="wallet-address">{shortAddress(address)}</div>
        </div>
        <div className="wallet-actions">
          <button
            className="signin-button"
            onClick={handleSignIn}
            title="Sign message to prove ownership"
          >
            ✍️ Sign Message
          </button>
          <button
            className="disconnect-button"
            onClick={() => disconnect()}
          >
            🔌 Disconnect
          </button>
        </div>
        <div className="wallet-tip">
          💡 Use Sign Message to prove wallet ownership for enhanced security
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-options">
      <div className="wallet-subtitle">Choose your wallet to play:</div>
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={!connector.ready}
          className={`wallet-option ${!connector.ready ? 'disabled' : ''}`}
        >
          <div className="wallet-option-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Image
                src={`/logo.png`}
                alt={`${connector.name} logo`}
                width={24}
                height={24}
                style={{
                  borderRadius: '4px'
                }}
                onError={() => {
                  // Fallback will be handled by Next.js Image component
                }}
              />
              <div className="wallet-option-info">
                <div className="wallet-option-name">{connector.name}</div>
                {!connector.ready && (
                  <div className="wallet-option-status">Not installed</div>
                )}
              </div>
            </div>
            {status === 'pending' && (
              <div className="wallet-option-status">Connecting...</div>
            )}
          </div>
        </button>
      ))}

      {error && (
        <div className="wallet-error">
          ⚠️ {error.message}
        </div>
      )}

      <div className="wallet-supported">
        📱 Supported: MetaMask, WalletConnect v2, Coinbase Wallet
      </div>
    </div>
  );
}