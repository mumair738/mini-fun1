import { ethers } from 'ethers';

// ERC-20 Token ABI (simplified)
const TOKEN_ABI = [
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function balanceOf(address account) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
  'function symbol() external view returns (string)',
];

// Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

// Initialize token contract
const tokenAddress = process.env.TOKEN_ADDRESS!;
const tokenContract = new ethers.Contract(tokenAddress, TOKEN_ABI, wallet);

export class BlockchainService {
  static async getTokenBalance(address: string): Promise<string> {
    try {
      const balance = await tokenContract.balanceOf(address);
      const decimals = await tokenContract.decimals();
      const symbol = await tokenContract.symbol();
      
      const formattedBalance = ethers.formatUnits(balance, decimals);
      return `${formattedBalance} ${symbol}`;
    } catch (error) {
      console.error('Error getting token balance:', error);
      return 'Error fetching balance';
    }
  }

  static async sendTokens(to: string, amount: string): Promise<string> {
    try {
      console.log(`Sending ${amount} tokens to ${to}`);
      
      // Convert amount to wei (assuming 18 decimals for Zora token)
      const amountWei = ethers.parseUnits(amount, 18);
      
      // Send the transaction
      const tx = await tokenContract.transfer(to, amountWei);
      
      console.log('Transaction sent:', tx.hash);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt?.hash);
      
      return receipt?.hash || tx.hash;
    } catch (error) {
      console.error('Error sending tokens:', error);
      throw new Error('Failed to send tokens');
    }
  }

  static async getWalletBalance(): Promise<string> {
    try {
      const balance = await provider.getBalance(wallet.address);
      const ethBalance = ethers.formatEther(balance);
      return `${ethBalance} ETH`;
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      return 'Error fetching balance';
    }
  }
}

export default BlockchainService;