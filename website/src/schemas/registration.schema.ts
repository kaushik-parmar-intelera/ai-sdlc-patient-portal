import { z } from 'zod';

export const registrationSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(128, 'First name must not exceed 128 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Only letters, spaces, hyphens, and apostrophes allowed'),

  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(128, 'Last name must not exceed 128 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Only letters, spaces, hyphens, and apostrophes allowed'),

  email: z
    .string()
    .email('Invalid email address')
    .max(254, 'Email must not exceed 254 characters'),

  medicalId: z
    .string()
    .min(1, 'Medical ID is required'),

  password: z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^a-zA-Z0-9]/, 'Must contain a special character'),

  terms: z
    .boolean()
    .refine(val => val === true, 'You must agree to the Terms of Service'),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

export const validateRegistration = (data: unknown) => {
  return registrationSchema.safeParse(data);
};
