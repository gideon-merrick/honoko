import { z } from "zod";

export const createCatSchema = z.object({
  name: z.string(),
  age: z.number().positive().max(50),
});

export const updateCatSchema = z.object({
  name: z.string().optional(),
  age: z.number().positive().max(50).optional(),
});
