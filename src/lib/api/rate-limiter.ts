import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, '1 m'),
  prefix: 'starfrom:api:',
  analytics: true
});

export async function checkRateLimit(apiKeyId: string): Promise<{ 
  success: boolean; 
  remaining: number; 
  reset: number;
  limit: number;
}> {
  const { success, remaining, reset } = await rateLimiter.limit(apiKeyId);
  
  return {
    success,
    remaining,
    reset,
    limit: 60
  };
}

export function getRateLimitHeaders(result: { 
  success: boolean; 
  remaining: number; 
  reset: number;
  limit: number;
}): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': Math.max(0, result.remaining).toString(),
    'X-RateLimit-Reset': new Date(result.reset).toISOString()
  };
}
