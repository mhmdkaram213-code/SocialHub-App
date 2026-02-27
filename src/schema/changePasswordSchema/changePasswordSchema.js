import { z } from 'zod';

export const changePasswordSchema = z.object({
  password: z
    .string()
    .min(6, 'Current password must be at least 6 characters')
    .min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(6, 'New password must be at least 6 characters')
    .min(1, 'New password is required'),
  rePassword: z
    .string()
    .min(6, 'Confirm password must be at least 6 characters')
    .min(1, 'Confirm password is required')
}).refine((data) => data.newPassword === data.rePassword, {
  message: "Passwords don't match",
  path: ["rePassword"],
}).refine((data) => data.password !== data.newPassword, {
  message: 'New password must be different from current password',
  path: ["newPassword"],
});
