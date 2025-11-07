import { NextRequest, NextResponse } from 'next/server';
import BlockchainService from '@/lib/blockchain';
import RedisService from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    let userAddress = '';
    
    try {
      // Try to get body as text first, then parse as JSON
      const body = await request.text();
      console.log('Received body:', body);
      
      if (!body) {
        return NextResponse.json({ error: 'Request body is empty' }, { status: 400 });
      }
      
      const parsed = JSON.parse(body);
      userAddress = parsed.userAddress || '';
    } catch (e) {
      console.error('JSON parsing error:', e);
      return NextResponse.json({ error: 'Invalid JSON format' }, { status: 400 });
    }
    
    if (!userAddress) {
      return NextResponse.json({ error: 'User address required' }, { status: 400 });
    }

    // Check if user can flip (max 2 per day)
    const maxFlipsPerDay = parseInt(process.env.MAX_FLIPS_PER_DAY || '2');
    const canFlip = await RedisService.canFlip(userAddress, maxFlipsPerDay);
    
    if (!canFlip) {
      const remaining = await RedisService.getFlipsRemaining(userAddress, maxFlipsPerDay);
      return NextResponse.json({
        error: 'Daily flip limit reached',
        remaining: remaining,
        maxFlipsPerDay: maxFlipsPerDay,
        message: `You've used all ${maxFlipsPerDay} flips for today!`
      }, { status: 429 });
    }

    // Simulate flip result (30% win rate)
    const win = Math.random() > 0.7; // 30% win rate
    const flipAmount = process.env.FLIP_AMOUNT || '0.0001'; // Zora tokens to send on win
    
    const meme = {
      id: Math.floor(Math.random() * 6) + 1,
      title: `Meme ${Math.floor(Math.random() * 6) + 1}`,
      emoji: ['🐕', '🐱', '😎', '🚀', '💎', '🔥'][Math.floor(Math.random() * 6)]
    };

    // Record the flip attempt in Redis
    await RedisService.recordFlip(userAddress);
    const flipsRemaining = await RedisService.getFlipsRemaining(userAddress, maxFlipsPerDay);

    if (win) {
      try {
        // Send real Zora tokens to the user
        const txHash = await BlockchainService.sendTokens(userAddress, flipAmount);
        
        console.log(`✅ Successful flip! Sent ${flipAmount} ZORA tokens to ${userAddress}`);
        console.log(`Transaction hash: ${txHash}`);
        
        return NextResponse.json({
          win: true,
          meme,
          txHash: txHash,
          amount: flipAmount,
          message: `🎉 You won! ${flipAmount} ZORA tokens sent to your wallet!`,
          remainingFlips: flipsRemaining,
          tokenAddress: process.env.TOKEN_ADDRESS
        });
      } catch (tokenError) {
        console.error('Failed to send tokens:', tokenError);
        
        return NextResponse.json({
          win: true,
          meme,
          txHash: null,
          amount: flipAmount,
          message: `You won! But token transfer failed. Please try again.`,
          remainingFlips: flipsRemaining,
          error: 'Token transfer failed'
        }, { status: 500 });
      }
    } else {
      console.log(`❌ ${userAddress} lost the flip (no tokens sent)`);
      
      return NextResponse.json({
        win: false,
        meme,
        message: '😢 You lost! No tokens sent. Better luck next time!',
        remainingFlips: flipsRemaining,
        flipAmount: flipAmount
      });
    }
    
  } catch (error) {
    console.error('Flip API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}