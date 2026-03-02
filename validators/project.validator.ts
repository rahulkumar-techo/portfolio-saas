/**
 * Project Validation Schema
 * Handles create & update validation
 */

import { z } from "zod";

/* ---------- Base Schema ---------- */

const BaseProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description cannot exceed 1000 characters"),

  tech: z
    .array(
      z.string().trim().min(1, "Tech stack item cannot be empty")
    )
    .min(1, "At least one tech is required")
    .max(20, "Too many tech items"),

  link: z
    .string()
    .trim()
    .refine(
      (val) =>
        val.startsWith("http://") ||
        val.startsWith("https://"),
      { message: "Project link must start with http:// or https://" }
    ),

  image: z
    .string()
    .trim()
    .min(1, "Project image is required"),

  stars: z
    .number()
    .int("Stars must be an integer")
    .nonnegative("Stars cannot be negative")
    .default(0),
}).strict();

/* ---------- Create Schema ---------- */

export const CreateProjectSchema = BaseProjectSchema;

/* ---------- Update Schema ---------- */

export const UpdateProjectSchema = BaseProjectSchema.partial();