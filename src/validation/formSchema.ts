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

const normalizeTextValue = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }

  return '';
};

const normalizeFile = (value: unknown): File | null => {
  if (value instanceof File) {
    return value;
  }

  if (typeof FileList !== 'undefined' && value instanceof FileList) {
    return value.item(0);
  }

  return null;
};

const imageFieldSchema = z
  .custom<File>((value) => value instanceof File, {
    message: 'Image is required',
  })
  .refine((file) => file.name.length > 0, 'Image is required')
  .refine(
    (file) => file.type === 'image/png' || file.type === 'image/jpeg',
    'Image must be png or jpeg',
  )
  .refine((file) => file.size <= 2 * 1024 * 1024, 'Image size must be at most 2 MB');

export const createBasicFormSchema = (countries: string[]) =>
  z
    .object({
      name: z.preprocess(normalizeTextValue, z.string()).pipe(
        z
          .string()
          .trim()
          .min(1, 'Name is required')
          .refine(upperCaseFirstLetter, 'Name must start with an uppercase letter'),
      ),
      age: z.preprocess(
        normalizeAgeValue,
        z.number({ message: 'Age is required' }).min(0, 'Age must be zero or greater'),
      ),
      email: z.preprocess(normalizeTextValue, z.string()).pipe(
        z.string().trim().min(1, 'Email is required').email('Email is invalid'),
      ),
      gender: z.preprocess(normalizeTextValue, z.string()).pipe(
        z.string().min(1, 'Gender is required'),
      ),
      acceptedTerms: z.literal(true, {
        message: 'You must accept terms and conditions',
      }),
      password: z.preprocess(normalizeTextValue, z.string()).pipe(
        z
          .string()
          .min(8, 'Password must have at least 8 characters')
          .max(64, 'Password is too long'),
      ),
      confirmPassword: z.preprocess(normalizeTextValue, z.string()).pipe(
        z.string().min(1, 'Please confirm password'),
      ),
      country: z.preprocess(normalizeTextValue, z.string()).pipe(
        z
          .string()
          .min(1, 'Country is required')
          .refine((value) => countries.includes(value), 'Country must be selected from the list'),
      ),
      imageFile: z.preprocess(normalizeFile, imageFieldSchema),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: 'Passwords must match',
      path: ['confirmPassword'],
    });

export type BasicFormValues = z.infer<ReturnType<typeof createBasicFormSchema>>;
