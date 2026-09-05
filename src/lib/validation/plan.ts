import { z } from "zod";

export const createPlanSchema = z
  .object({
    title: z.string().min(1).max(100),
    description: z.string().max(500).optional(),

    startDate: z.string(),
    endDate: z.string(),

    durationMinutes: z.number().int().positive().nullable(),
    durationDays: z.number().int().positive().nullable(),

    responseDeadline: z.string(),
  })
  .refine(
    (data) =>
      (data.durationMinutes !== null && data.durationDays === null) ||
      (data.durationMinutes === null && data.durationDays !== null),
    {
      message: "Choose either a minute-based or day-based duration.",
    }
  );