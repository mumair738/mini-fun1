import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export class RedisService {
  private static getDailyKey(address: string): string {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    return `flip:daily:${address}:${today}`;
  }

  private static getWeeklyKey(address: string): string {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())).toISOString().split('T')[0];
    return `flip:weekly:${address}:${startOfWeek}`;
  }

  static async getDailyFlips(address: string): Promise<number> {
    try {
      const key = this.getDailyKey(address);
      const count = await redis.get(key);
      return typeof count === 'number' ? count : 0;
    } catch (error) {
      console.error('Error getting daily flips:', error);
      return 0;
    }
  }

  static async incrementDailyFlips(address: string): Promise<number> {
    try {
      const key = this.getDailyKey(address);
      const count = await redis.incr(key);
      
      // Set expiry for 24 hours
      await redis.expire(key, 24 * 60 * 60);
      
      return count;
    } catch (error) {
      console.error('Error incrementing daily flips:', error);
      throw new Error('Failed to track flip count');
    }
  }

  static async canFlip(address: string, maxFlipsPerDay: number = 2): Promise<boolean> {
    try {
      const currentFlips = await this.getDailyFlips(address);
      return currentFlips < maxFlipsPerDay;
    } catch (error) {
      console.error('Error checking flip eligibility:', error);
      return false;
    }
  }

  static async recordFlip(address: string): Promise<boolean> {
    try {
      const canFlip = await this.canFlip(address);
      if (!canFlip) {
        return false;
      }

      await this.incrementDailyFlips(address);
      return true;
    } catch (error) {
      console.error('Error recording flip:', error);
      return false;
    }
  }

  static async getFlipsRemaining(address: string, maxFlipsPerDay: number = 2): Promise<number> {
    try {
      const currentFlips = await this.getDailyFlips(address);
      return Math.max(0, maxFlipsPerDay - currentFlips);
    } catch (error) {
      console.error('Error getting remaining flips:', error);
      return 0;
    }
  }

  static async resetDailyFlips(address: string): Promise<void> {
    try {
      const key = this.getDailyKey(address);
      await redis.del(key);
    } catch (error) {
      console.error('Error resetting daily flips:', error);
    }
  }
}

export default RedisService;