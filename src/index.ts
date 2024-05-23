import { PrismaClient } from "@prisma/client";
import express from "express";
import { ZodError, z } from "zod";
import { getNumberOrFallback } from "./utils";

const server = express();

server.use(express.json());
const port = getNumberOrFallback(process.env.PORT, 8000);
const prisma = new PrismaClient();

const contactBaseSchema = z
  .object({
    email: z.string().optional(),
    phoneNumber: z
      .string()
      .refine((value) => !Number.isNaN(Number(value)), { message: "'phoneNumber' provided is invalid" })
      .optional(),
  })
  .refine(({ email, phoneNumber }) => email || phoneNumber, { message: "'email' or 'phoneNumber' must be provided within a JSON object in request body" });

server.get("/", (_req, res) => res.sendStatus(200));

server.get("/identify", async (req, res) => {
  try {
    const data = contactBaseSchema.parse(req.body);
    return res.json(data);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json(err.errors);
    }
    return res.status(500).send(err);
  }
});

server.listen({ port }, () => {
  console.log(`Server started on port: ${port}`);
});
