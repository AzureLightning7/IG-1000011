---
name: "logger-winston"
description: "Configures Winston logger for structured logging in Node.js applications. Invoke when setting up logging, debugging API calls, or needing production-ready log management."
---

# Logger Configuration with Winston

## Installation
```bash
npm install winston
```

## Basic Setup

### Create Logger
```typescript
// api/utils/logger.ts
import winston from 'winston';

const { combine, timestamp, json, errors, printf, colorize } = winston.format;

// Custom format for development
const devFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  if (stack) {
    msg += `\n${stack}`;
  }
  return msg;
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: { service: 'dormvibe-api' },
  transports: [
    // Console output
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        process.env.NODE_ENV === 'production' ? json() : devFormat
      ),
    }),
    
    // File output for errors
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(timestamp(), json()),
    }),
    
    // File output for all logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: combine(timestamp(), json()),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
});
```

## Usage Examples

### API Route Logging
```typescript
import { logger } from '../utils/logger.js';

export const generateText = async (req: Request, res: Response) => {
  logger.info('Starting text generation', { 
    sessionId: req.body.sessionId,
    interests: req.body.interests,
  });
  
  try {
    const result = await callMiniMaxAPI(req.body);
    logger.info('Text generation completed', { 
      sessionId: req.body.sessionId,
      duration: result.duration,
    });
    res.json(result);
  } catch (error) {
    logger.error('Text generation failed', {
      sessionId: req.body.sessionId,
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: 'Generation failed' });
  }
};
```

### External API Logging
```typescript
export const minimaxClient = () => {
  const client = axios.create({ baseURL: process.env.MINIMAX_BASE_URL });
  
  client.interceptors.request.use((config) => {
    logger.debug('MiniMax API Request', {
      method: config.method,
      url: config.url,
      data: config.data,
    });
    return config;
  });
  
  client.interceptors.response.use(
    (response) => {
      logger.debug('MiniMax API Response', {
        status: response.status,
        data: response.data,
      });
      return response;
    },
    (error) => {
      logger.error('MiniMax API Error', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      return Promise.reject(error);
    }
  );
  
  return client;
};
```

## Log Levels
- `error`: Errors that need immediate attention
- `warn`: Warning conditions
- `info`: Normal operational messages
- `http`: HTTP request logs
- `verbose`: Detailed operational info
- `debug`: Debug information
- `silly`: Extremely detailed logs

## Best Practices
- Always include contextual data (userId, sessionId, requestId)
- Never log sensitive data (passwords, API keys)
- Use appropriate log levels
- Structure logs as JSON in production
