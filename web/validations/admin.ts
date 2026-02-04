import { z } from "zod";

export const updateUserSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["student", "tutor", "admin"], {
    required_error: "Role is required",
  }),
});

export const createThemeSchema = z.object({
  name: z
    .string()
    .min(2, "Theme name must be at least 2 characters")
    .max(50, "Theme name must be less than 50 characters"),
  emoji: z
    .string()
    .max(10, "Emoji must be less than 10 characters")
    .optional()
    .nullable(),
});

export const updateThemeSchema = z.object({
  themeId: z.string().uuid("Invalid theme ID"),
  name: z
    .string()
    .min(2, "Theme name must be at least 2 characters")
    .max(50, "Theme name must be less than 50 characters"),
  emoji: z
    .string()
    .max(10, "Emoji must be less than 10 characters")
    .optional()
    .nullable(),
});

export const deleteThemeSchema = z.object({
  themeId: z.string().uuid("Invalid theme ID"),
});

export const deleteUserSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
});

export const deleteCourseSchema = z.object({
  courseId: z.string().uuid("Invalid course ID"),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateThemeInput = z.infer<typeof createThemeSchema>;
export type UpdateThemeInput = z.infer<typeof updateThemeSchema>;
export type DeleteThemeInput = z.infer<typeof deleteThemeSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
export type DeleteCourseInput = z.infer<typeof deleteCourseSchema>;
