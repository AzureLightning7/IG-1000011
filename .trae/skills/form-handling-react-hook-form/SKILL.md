---
name: "form-handling-react-hook-form"
description: "Builds performant and validated forms using React Hook Form with Zod integration. Invoke when creating complex forms, needing field validation, or optimizing form re-renders."
---

# Form Handling with React Hook Form

## Installation
```bash
npm install react-hook-form @hookform/resolvers zod
```

## Basic Setup

```tsx
// src/components/VibeQuizForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const quizSchema = z.object({
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
  colorPalette: z.string().min(1, 'Choose a color palette'),
  budget: z.number().min(50).max(5000),
  isInternational: z.boolean(),
  country: z.string().optional(),
  priority: z.enum(['budget', 'style', 'comfort']),
});

type QuizFormData = z.infer<typeof quizSchema>;

export const VibeQuizForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      interests: [],
      budget: 500,
      isInternational: false,
      priority: 'style',
    },
  });

  const onSubmit = async (data: QuizFormData) => {
    console.log(data);
    // Submit to API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Form fields */}
    </form>
  );
};
```

## Form Fields

### Text Input
```tsx
<div>
  <label className="block text-sm font-medium mb-1">
    Country
  </label>
  <input
    {...register('country')}
    className="w-full px-4 py-2 border rounded-lg"
    placeholder="Enter your country"
  />
  {errors.country && (
    <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
  )}
</div>
```

### Number Input
```tsx
<div>
  <label className="block text-sm font-medium mb-1">
    Budget ($)
  </label>
  <input
    type="number"
    {...register('budget', { valueAsNumber: true })}
    className="w-full px-4 py-2 border rounded-lg"
  />
  {errors.budget && (
    <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
  )}
</div>
```

### Checkbox Group
```tsx
<div>
  <label className="block text-sm font-medium mb-2">Interests</label>
  <div className="space-y-2">
    {['Gaming', 'Reading', 'Fitness', 'Art', 'Music'].map((interest) => (
      <label key={interest} className="flex items-center">
        <input
          type="checkbox"
          value={interest}
          {...register('interests')}
          className="mr-2"
        />
        {interest}
      </label>
    ))}
  </div>
  {errors.interests && (
    <p className="text-red-500 text-sm mt-1">{errors.interests.message}</p>
  )}
</div>
```

### Select Dropdown
```tsx
<div>
  <label className="block text-sm font-medium mb-1">Priority</label>
  <select
    {...register('priority')}
    className="w-full px-4 py-2 border rounded-lg"
  >
    <option value="budget">Budget</option>
    <option value="style">Style</option>
    <option value="comfort">Comfort</option>
  </select>
  {errors.priority && (
    <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>
  )}
</div>
```

### Conditional Fields
```tsx
const isInternational = watch('isInternational');

// ...

{isInternational && (
  <div>
    <label className="block text-sm font-medium mb-1">
      Home Country *
    </label>
    <input
      {...register('country', { required: isInternational })}
      className="w-full px-4 py-2 border rounded-lg"
    />
    {errors.country && (
      <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
    )}
  </div>
)}
```

## Advanced Patterns

### Controlled Components (Custom Inputs)
```tsx
import { Controller } from 'react-hook-form';

// Custom slider component
<Controller
  name="budget"
  control={control}
  render={({ field }) => (
    <BudgetSlider
      value={field.value}
      onChange={field.onChange}
      min={50}
      max={5000}
    />
  )}
/>
```

### Field Arrays (Dynamic Lists)
```tsx
import { useFieldArray } from 'react-hook-form';

const { fields, append, remove } = useFieldArray({
  control,
  name: 'interests',
});

// Render dynamic list
{fields.map((field, index) => (
  <div key={field.id} className="flex gap-2">
    <input
      {...register(`interests.${index}`)}
      className="flex-1 px-4 py-2 border rounded-lg"
    />
    <button
      type="button"
      onClick={() => remove(index)}
      className="px-3 py-2 text-red-600"
    >
      Remove
    </button>
  </div>
))}

<button
  type="button"
  onClick={() => append('')}
  className="px-4 py-2 text-blue-600"
>
  Add Interest
</button>
```

### Async Validation
```tsx
const schema = z.object({
  email: z.string().email().refine(
    async (email) => {
      const exists = await checkEmailExists(email);
      return !exists;
    },
    { message: 'Email already registered' }
  ),
});
```

### Form Context (Multi-Step Forms)
```tsx
import { FormProvider, useFormContext } from 'react-hook-form';

// Parent component
const MultiStepForm = () => {
  const methods = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {step === 1 && <StepOne />}
        {step === 2 && <StepTwo />}
        {step === 3 && <StepThree />}
      </form>
    </FormProvider>
  );
};

// Child component
const StepOne = () => {
  const { register, formState: { errors } } = useFormContext<QuizFormData>();
  
  return (
    <div>
      <input {...register('interests')} />
      {errors.interests && <span>{errors.interests.message}</span>}
    </div>
  );
};
```

## Form Submission

```tsx
const onSubmit = async (data: QuizFormData) => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Failed to submit');
    
    const result = await response.json();
    navigate('/results', { state: result });
  } catch (error) {
    // Handle error
  }
};

// Submit button
<button
  type="submit"
  disabled={isSubmitting}
  className="w-full py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
>
  {isSubmitting ? 'Generating...' : 'Generate My Vibe'}
</button>
```

## Best Practices
- Use `zodResolver` for schema validation
- Set appropriate `defaultValues`
- Disable submit button during `isSubmitting`
- Use `Controller` for custom/third-party inputs
- Leverage `watch` for conditional fields
- Use `FormProvider` for deeply nested forms
