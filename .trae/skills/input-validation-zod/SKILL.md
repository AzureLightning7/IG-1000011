---
name: "input-validation-zod"
description: "Validates user inputs and API payloads using Zod schemas. Invoke when handling form submissions, API requests, or any external data that needs type safety and validation."
---

# Input Validation with Zod

## Installation
```bash
npm install zod
```

## Basic Usage

### Creating Schemas
```typescript
import { z } from 'zod';

// Basic schema
const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  age: z.number().int().min(0).max(150).optional(),
});

type User = z.infer<typeof userSchema>;
```

### Validating API Requests (Express)
```typescript
import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

const quizDataSchema = z.object({
  interests: z.array(z.string()).min(1, "At least one interest required"),
  colorPalette: z.string().min(1, "Color palette is required"),
  budget: z.number().int().min(50).max(5000),
  isInternational: z.boolean(),
  country: z.string().optional(),
  priority: z.enum(['budget', 'style', 'comfort']),
});

export const validateQuizData = (req: Request, res: Response, next: NextFunction) => {
  const result = quizDataSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.error.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }
  
  req.body = result.data;
  next();
};
```

### Form Validation (React)
```typescript
import { z } from 'zod';
import { useState } from 'react';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = (data: unknown) => {
    const result = formSchema.safeParse(data);
    
    if (!result.success) {
      const formatted: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        formatted[issue.path.join('.')] = issue.message;
      });
      setErrors(formatted);
      return null;
    }
    
    setErrors({});
    return result.data;
  };
  
  return { validate, errors };
};
```

## Common Patterns

### Coercion (string to number)
```typescript
const schema = z.object({
  budget: z.coerce.number().min(50),
  isInternational: z.coerce.boolean(),
});
```

### Custom Validation
```typescript
const passwordSchema = z.string()
  .min(8)
  .regex(/[A-Z]/, "Must contain uppercase")
  .regex(/[0-9]/, "Must contain number");
```

### Array Validation
```typescript
const schema = z.object({
  interests: z.array(z.string()).min(1).max(10),
});
```

## Error Handling
- Always use `safeParse` for graceful error handling
- Format errors for user-friendly display
- Return 400 status for validation failures
