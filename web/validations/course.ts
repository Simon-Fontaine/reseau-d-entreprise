import { z } from "zod";

const courseLevels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
const publishStatuses = ["draft", "published", "unpublished"] as const;

export const courseLevelSchema = z.enum(courseLevels);
export const coursePublishStatusSchema = z.enum(publishStatuses);

export const courseSchema = z.object({
  title: z.string().trim().min(3, "Title is required").max(200),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  minLevel: courseLevelSchema,
  maxLevel: courseLevelSchema,
  themeId: z.string().uuid().optional().or(z.literal("")),
  estimatedDuration: z.coerce
    .number()
    .int()
    .min(0, "Duration must be positive")
    .max(20000, "Duration is too large")
    .optional()
    .or(z.literal("")),
  emoji: z.string().trim().max(10).optional().or(z.literal("")),
  imageUrl: z.string().trim().url().optional().or(z.literal("")),
  publishStatus: coursePublishStatusSchema,
});

export const chapterSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(200),
  contentMarkdown: z.string().trim().max(5000).optional().or(z.literal("")),
  orderIndex: z.coerce
    .number()
    .int()
    .min(1, "Order must be at least 1")
    .max(1000, "Order is too large"),
});

export const quizQuestionSchema = z.object({
  questionText: z.string().trim().min(4, "Question is required").max(500),
  points: z.coerce
    .number()
    .int()
    .min(1, "Points must be at least 1")
    .max(100, "Points is too large"),
});

export const quizOptionSchema = z.object({
  optionText: z.string().trim().min(1, "Option text is required").max(255),
  isCorrect: z
    .string()
    .optional()
    .transform((value) => value === "on"),
});
