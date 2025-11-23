import { ethers } from 'ethers';

const { RPC_URL, PRIVATE_KEY, TOKEN_ADDRESS } = process.env;

if (!RPC_URL || !PRIVATE_KEY || !TOKEN_ADDRESS) {
  throw new Error("Missing required environment variables");
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const TOKEN_ABI = [
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function balanceOf(address account) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
  'function symbol() external view returns (string)',
];

const tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, wallet);

export class BlockchainService {
  
  static async getTokenBalance(address: string): Promise<string> {
    try {
      const [balance, decimals, symbol] = await Promise.all([
        tokenContract.balanceOf(address),
        tokenContract.decimals(),
        tokenContract.symbol(),
      ]);

      return `${ethers.formatUnits(balance, decimals)} ${symbol}`;
    } catch (error) {
      console.error('Error getting token balance:', error);
      return 'Error fetching balance';
    }
  }

  static async sendTokens(to: string, amount: string): Promise<string> {
    try {
      const decimals = await tokenContract.decimals();
      const amountWei = ethers.parseUnits(amount, decimals);

      const tx = await tokenContract.transfer(to, amountWei);
      console.log("Transaction sent:", tx.hash);

      const receipt = await tx.wait(1);
      console.log("Transaction confirmed:", receipt.hash);

      return receipt.hash;
    } catch (error) {
      console.error('Error sending tokens:', error);
      throw new Error('Failed to send tokens');
    }
  }

  static async getWalletBalance(): Promise<string> {
    try {
      const balance = await provider.getBalance(wallet.address);
      return `${ethers.formatEther(balance)} ETH`;
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      return 'Error fetching balance';
    }
  }
}

export default BlockchainService;
