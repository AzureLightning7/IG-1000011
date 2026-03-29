---
name: "rate-limiting-redis"
description: "Implements API rate limiting using Redis to prevent abuse and control costs. Invoke when protecting external API endpoints, preventing spam, or implementing tiered access limits."
---

# Rate Limiting with Redis

## Installation
```bash
npm install ioredis express-rate-limit rate-limit-redis
```

## Basic Setup

```typescript
// api/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

// General API rate limit
export const apiLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
  },
});

// Strict limit for expensive operations (MiniMax API calls)
export const aiGenerationLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: 'rl:ai:',
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 AI generations per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'AI generation limit reached. Please try again in an hour.',
  },
  skip: (req) => {
    // Skip rate limiting for admin users
    return req.headers['x-admin-key'] === process.env.ADMIN_API_KEY;
  },
});

// Per-user rate limit (if authenticated)
export const userLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: 'rl:user:',
  }),
  windowMs: 15 * 60 * 1000,
  max: 50,
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise IP
    return req.user?.id || req.ip || 'unknown';
  },
});
```

## Usage in Routes

```typescript
// api/routes/generate.ts
import { Router } from 'express';
import { aiGenerationLimiter } from '../middleware/rateLimit.js';

const router = Router();

// Apply strict rate limiting to expensive AI operations
router.post('/text', aiGenerationLimiter, generateText);
router.post('/image', aiGenerationLimiter, generateImage);
router.post('/tts', aiGenerationLimiter, generateTTS);

export default router;
```

```typescript
// api/app.ts
import express from 'express';
import { apiLimiter } from './middleware/rateLimit.js';

const app = express();

// Apply general rate limiting to all API routes
app.use('/api/', apiLimiter);

// ... routes
```

## Custom Rate Limit by Endpoint

```typescript
// api/middleware/customRateLimit.ts
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis();

export const createRateLimiter = (options: {
  windowMs: number;
  max: number;
  keyPrefix?: string;
}) => {
  return rateLimit({
    store: new RedisStore({
      sendCommand: (...args: string[]) => redis.call(...args),
      prefix: options.keyPrefix || 'rl:',
    }),
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil(options.windowMs / 1000),
      });
    },
  });
};

// Usage
export const quizLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // 3 quiz submissions per 5 minutes
  keyPrefix: 'rl:quiz:',
});
```

## Sliding Window Rate Limit

```typescript
// api/middleware/slidingWindow.ts
import Redis from 'ioredis';

const redis = new Redis();

export const slidingWindowLimiter = (
  windowMs: number,
  maxRequests: number
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `sw:${req.ip}:${req.path}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Remove old entries
    await redis.zremrangebyscore(key, 0, windowStart);

    // Count current requests
    const count = await redis.zcard(key);

    if (count >= maxRequests) {
      const oldest = await redis.zrange(key, 0, 0, 'WITHSCORES');
      const retryAfter = Math.ceil((parseInt(oldest[1]) + windowMs - now) / 1000);
      
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        retryAfter,
      });
    }

    // Add current request
    await redis.zadd(key, now, `${now}-${Math.random()}`);
    await redis.pexpire(key, windowMs);

    next();
  };
};
```

## Best Practices
- Use Redis for distributed rate limiting (multiple servers)
- Set different limits for different endpoints
- Return `Retry-After` header
- Log rate limit hits for monitoring
- Consider user-based limits for authenticated users
- Implement exponential backoff on client side
