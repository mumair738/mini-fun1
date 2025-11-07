# 🔗 Wallet Connect Integration Guide

This guide explains how to use the new `FarcasterWalletConnect` component in your mini-fun1 application.

## Overview

The `FarcasterWalletConnect` component provides additional wallet connection options beyond the built-in FarCaster wallet integration. It supports:

- **MetaMask** - Popular browser wallet
- **WalletConnect v2** - Connect 300+ wallets via QR code
- **Coinbase Wallet** - Coinbase's mobile wallet
- **Farcaster Wallet** - Built-in FarCaster wallet

## Quick Start

### 1. Environment Variables

Add your credentials to `.env.local`:

```bash
# Required for WalletConnect v2
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_from_walletconnect

# Optional: Enhanced OnchainKit features
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key
```

**Get WalletConnect Project ID:**
1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Sign up for a free account
3. Create a new project
4. Copy the Project ID

### 2. Usage in Your App

The component is already integrated into the main page. Users can click "🔗 Connect External Wallet" to access it.

```jsx
import FarcasterWalletConnect from "./components/FarcasterWalletConnect";

// In your component
<FarcasterWalletConnect />
```

### 3. Component Features

#### Connection Status
- Shows connected wallet address
- Allows signing messages for authentication
- Easy disconnect functionality

#### Supported Wallets
- **MetaMask**: Most popular browser wallet
- **WalletConnect**: Scan QR code with mobile wallet
- **Coinbase Wallet**: Coinbase's official wallet
- **Farcaster**: Built-in FarCaster wallet support

#### Authentication
The component includes a "Sign Message" feature that:
- Proves wallet ownership
- Can be used for session management
- Provides enhanced security

## Advanced Integration

### Custom Styling

The component uses CSS classes that you can override:

```css
.wallet-connect-container {
  /* Main container styling */
}

.wallet-option {
  /* Individual wallet option styling */
}

.connected-wallet {
  /* Connected state styling */
}
```

### Event Handling

You can extend the component to handle connection events:

```jsx
// In the component, you can add:
useEffect(() => {
  if (address) {
    // User connected a wallet
    console.log('Wallet connected:', address);
    // Send to your backend for session creation
  }
}, [address]);
```

### Integration with Your Game Logic

The connected wallet address can be used in your existing game logic:

```jsx
const { address } = useAccount();

const handleFlipWithExternalWallet = async () => {
  if (address) {
    // Use the external wallet address
    const response = await fetch('/api/flip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userAddress: address }),
    });
    // Handle response...
  }
};
```

## Dual Wallet Support

Your app now supports **two types of wallet connections**:

1. **FarCaster Native Wallet** (built-in)
   - Automatic connection via context
   - No setup required
   - Perfect for FarCaster users

2. **External Wallets** (via FarcasterWalletConnect)
   - User choice of wallet
   - Manual connection
   - More flexibility for advanced users

## API Integration

The connected wallet address can replace or complement the FarCaster wallet address in your API calls:

```javascript
// Using external wallet
const userAddress = externalWalletAddress || farcasterWalletAddress;

// Send to your flip API
const response = await fetch('/api/flip', {
  method: 'POST',
  body: JSON.stringify({ userAddress }),
});
```

## Security Considerations

1. **Message Signing**: Always verify signed messages on your backend
2. **Session Management**: Create sessions based on wallet address + signature
3. **Rate Limiting**: Apply rate limits per wallet address
4. **Validation**: Validate addresses before processing

## Troubleshooting

### Common Issues

1. **WalletConnect not working**
   - Check if `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set
   - Ensure project ID is valid

2. **MetaMask not appearing**
   - Make sure MetaMask is installed
   - Check browser console for errors

3. **Styling issues**
   - Verify CSS classes are properly imported
   - Check for conflicts with existing styles

### Debug Mode

Add this to see connection details:

```jsx
const { address, isConnected } = useAccount();
console.log('Wallet State:', { address, isConnected });
```

## Benefits

✅ **Enhanced User Choice** - Users can use their preferred wallet
✅ **Better Adoption** - Supports popular wallets like MetaMask
✅ **Cross-Platform** - WalletConnect enables mobile wallet support
✅ **Security** - Message signing for authentication
✅ **Seamless Integration** - Works alongside existing FarCaster integration

## Next Steps

1. Test with different wallets
2. Implement backend signature verification
3. Add wallet-specific features
4. Consider wallet connection analytics
5. Add wallet switching functionality

---

**Ready to enhance your mini app with multiple wallet support! 🎉**