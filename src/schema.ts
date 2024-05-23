import { z } from "zod";

export const contactBaseSchema = z
  .object({
    email: z.string().optional(),
    phoneNumber: z
      .string()
      .refine((value) => !Number.isNaN(Number(value)), { message: "'phoneNumber' provided is invalid" })
      .optional(),
  })
  .refine(({ email, phoneNumber }) => email || phoneNumber, { message: "'email' or 'phoneNumber' must be provided within a JSON object in request body" });
