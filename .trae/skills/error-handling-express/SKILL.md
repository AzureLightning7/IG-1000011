---
name: "error-handling-express"
description: "Implements comprehensive error handling for Express applications. Invoke when setting up Express server, creating API routes, or needing consistent error responses."
---

# Error Handling in Express

## Custom Error Classes

```typescript
// api/utils/errors.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true,
    public code?: string
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message, true, 'VALIDATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`, true, 'NOT_FOUND');
  }
}

export class ExternalAPIError extends AppError {
  constructor(service: string, message: string) {
    super(502, `${service} error: ${message}`, true, 'EXTERNAL_API_ERROR');
  }
}
```

## Global Error Handler

```typescript
// api/middleware/errorHandler.ts
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log the error
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
  });

  // Handle known operational errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.code,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Handle unexpected errors
  return res.status(500).json({
    success: false,
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { 
      message: err.message,
      stack: err.stack,
    }),
  });
};
```

## Async Handler Wrapper

```typescript
// api/utils/asyncHandler.ts
import type { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

## Usage in Routes

```typescript
// api/routes/generate.ts
import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ValidationError, ExternalAPIError } from '../utils/errors.js';

const router = Router();

router.post(
  '/',
  asyncHandler(async (req, res) => {
    // Validation
    if (!req.body.interests || req.body.interests.length === 0) {
      throw new ValidationError('At least one interest is required');
    }

    // External API call
    try {
      const result = await generateContent(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      throw new ExternalAPIError('MiniMax', error.message);
    }
  })
);

export default router;
```

## Not Found Handler

```typescript
// api/middleware/notFound.ts
import type { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../utils/errors.js';

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  next(new NotFoundError(`Route ${req.method} ${req.url}`));
};
```

## App Setup

```typescript
// api/app.ts
import express from 'express';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFound.js';

const app = express();

// ... routes ...

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(errorHandler);

export default app;
```

## Best Practices
- Always use asyncHandler for async routes
- Create custom error classes for different error types
- Log all errors with context
- Don't expose stack traces in production
- Use consistent error response format
