import { z } from 'zod';

const upperCaseFirstLetter = (value: string): boolean => {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return false;
  }

  return trimmed[0] === trimmed[0].toUpperCase();
};

const normalizeAgeValue = (value: unknown): number => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    return Number(value);
  }

  return Number.NaN;
};

export const basicFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .refine(upperCaseFirstLetter, 'Name must start with an uppercase letter'),
  age: z.preprocess(
    normalizeAgeValue,
    z.number({ message: 'Age is required' }).min(0, 'Age must be zero or greater'),
  ),
  email: z.string().trim().min(1, 'Email is required').email('Email is invalid'),
  gender: z.string().min(1, 'Gender is required'),
  acceptedTerms: z.literal(true, {
    message: 'You must accept terms and conditions',
  }),
});

export type BasicFormValues = z.infer<typeof basicFormSchema>;
