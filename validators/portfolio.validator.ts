/**
 * Portfolio Zod Validation
 */

import { z } from "zod";

export const updatePortfolioSchema = z.object({
  content: z.optional(z.object({
    hero: z.optional(z.object({
      name: z.string().min(1),
      title: z.string().optional(),
      summary: z.string().optional(),
      profileImage: z.string().optional(),
    })),
  })),

  design: z.optional(z.object({
    primaryColor: z.string(),
    layout: z.enum(["centered", "split", "grid"]),
    darkMode: z.boolean(),
  })),

  status: z.enum(["draft", "published", "archived"]).optional(),
});