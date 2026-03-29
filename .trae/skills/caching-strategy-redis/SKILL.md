---
name: "caching-strategy-redis"
description: "Implements Redis caching strategies to improve performance and reduce API costs. Invoke when caching expensive API responses, storing session data, or reducing database load."
---

# Caching Strategy with Redis

## Installation
```bash
npm install ioredis
```

## Basic Setup

```typescript
// api/utils/redis.ts
import Redis from 'ioredis';

export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

export default redis;
```

## Cache Service

```typescript
// api/services/cache.ts
import { redis } from '../utils/redis.js';

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
}

export class CacheService {
  private static readonly DEFAULT_TTL = 3600; // 1 hour

  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  static async set<T>(
    key: string,
    value: T,
    options: CacheOptions = {}
  ): Promise<void> {
    const { ttl = this.DEFAULT_TTL, tags = [] } = options;
    
    try {
      const serialized = JSON.stringify(value);
      await redis.setex(key, ttl, serialized);
      
      // Add to tag sets for bulk invalidation
      for (const tag of tags) {
        await redis.sadd(`tag:${tag}`, key);
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  static async delete(key: string): Promise<void> {
    await redis.del(key);
  }

  static async invalidateByTag(tag: string): Promise<void> {
    const keys = await redis.smembers(`tag:${tag}`);
    if (keys.length > 0) {
      await redis.del(...keys);
      await redis.del(`tag:${tag}`);
    }
  }

  static async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, options);
    return value;
  }
}
```

## API Response Caching

```typescript
// api/middleware/cache.ts
import { CacheService } from '../services/cache.js';
import type { Request, Response, NextFunction } from 'express';

export const cacheMiddleware = (
  ttl: number = 3600,
  keyGenerator?: (req: Request) => string
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const cacheKey = keyGenerator 
      ? keyGenerator(req) 
      : `cache:${req.method}:${req.originalUrl}:${JSON.stringify(req.body)}`;

    try {
      const cached = await CacheService.get(cacheKey);
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        return res.json(cached);
      }

      // Override res.json to cache the response
      const originalJson = res.json.bind(res);
      res.json = (body: unknown) => {
        res.setHeader('X-Cache', 'MISS');
        CacheService.set(cacheKey, body, { ttl });
        return originalJson(body);
      };

      next();
    } catch (error) {
      // If cache fails, continue without caching
      next();
    }
  };
};
```

## MiniMax API Response Caching

```typescript
// api/services/minimaxCache.ts
import { CacheService } from './cache.js';
import crypto from 'crypto';

export class MiniMaxCache {
  // Cache text generation responses
  static async getTextCache(prompt: string): Promise<string | null> {
    const key = this.generateKey('text', prompt);
    return CacheService.get<string>(key);
  }

  static async setTextCache(prompt: string, response: string): Promise<void> {
    const key = this.generateKey('text', prompt);
    // Cache for 24 hours since text responses are expensive
    await CacheService.set(key, response, { ttl: 86400, tags: ['minimax', 'text'] });
  }

  // Cache image generation URLs
  static async getImageCache(prompt: string): Promise<string | null> {
    const key = this.generateKey('image', prompt);
    return CacheService.get<string>(key);
  }

  static async setImageCache(prompt: string, imageUrl: string): Promise<void> {
    const key = this.generateKey('image', prompt);
    // Cache for 7 days since images don't change
    await CacheService.set(key, imageUrl, { ttl: 604800, tags: ['minimax', 'image'] });
  }

  private static generateKey(type: string, prompt: string): string {
    const hash = crypto.createHash('md5').update(prompt).digest('hex');
    return `minimax:${type}:${hash}`;
  }

  // Invalidate all MiniMax caches
  static async invalidateAll(): Promise<void> {
    await CacheService.invalidateByTag('minimax');
  }
}
```

## Usage in Services

```typescript
// api/services/textGen.ts
import { MiniMaxCache } from './minimaxCache.js';

export const generateText = async (quizData: QuizData) => {
  const cacheKey = JSON.stringify(quizData);
  
  // Check cache first
  const cached = await MiniMaxCache.getTextCache(cacheKey);
  if (cached) {
    console.log('Text generation cache hit');
    return JSON.parse(cached);
  }

  // Generate new content
  const result = await callMiniMaxAPI(quizData);
  
  // Cache the result
  await MiniMaxCache.setTextCache(cacheKey, JSON.stringify(result));
  
  return result;
};
```

## Session Caching

```typescript
// api/middleware/sessionCache.ts
import { CacheService } from '../services/cache.js';

interface SessionData {
  quizData?: QuizData;
  generatedContent?: GeneratedContent;
  createdAt: number;
}

export const sessionCache = {
  async get(sessionId: string): Promise<SessionData | null> {
    return CacheService.get<SessionData>(`session:${sessionId}`);
  },

  async set(sessionId: string, data: Partial<SessionData>): Promise<void> {
    const existing = await this.get(sessionId);
    const updated = {
      ...existing,
      ...data,
      createdAt: existing?.createdAt || Date.now(),
    };
    // Sessions expire after 24 hours
    await CacheService.set(`session:${sessionId}`, updated, { ttl: 86400 });
  },

  async delete(sessionId: string): Promise<void> {
    await CacheService.delete(`session:${sessionId}`);
  },
};
```

## Cache Warming

```typescript
// api/services/cacheWarming.ts
import { CacheService } from './cache.js';

export const warmCache = async () => {
  // Pre-populate cache with popular data
  const popularPrompts = [
    'cozy minimalist dorm',
    'boho chic room',
    'modern gaming setup',
  ];

  for (const prompt of popularPrompts) {
    try {
      const result = await generateText({ prompt });
      await CacheService.set(`popular:${prompt}`, result, { ttl: 86400 });
    } catch (error) {
      console.error(`Failed to warm cache for: ${prompt}`, error);
    }
  }
};
```

## Best Practices
- Set appropriate TTL based on data volatility
- Use cache tags for bulk invalidation
- Always handle cache failures gracefully
- Monitor cache hit rates
- Use cache warming for predictable data
- Implement cache stampede protection
