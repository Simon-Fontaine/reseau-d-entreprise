import { z } from "zod";
import { fullNameSchema, passwordSchema } from "./auth";

export const updateProfileSchema = z.object({
  fullName: fullNameSchema,
});

export const updateBioSchema = z.object({
  bio: z.string().trim().max(255, "Bio must be 255 characters or less"),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });
