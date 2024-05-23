import { PrismaClient } from "@prisma/client";
import express from "express";
import { ZodError, z } from "zod";
import { generatePayload, getNumberOrFallback } from "./utils";

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
    const { email, phoneNumber } = contactBaseSchema.parse(req.body);

    const contacts = await prisma.contact.findMany({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });

    if (!contacts.length) {
      // Create contact if not exists
      const created = await prisma.contact.create({
        data: {
          linkPrecedence: "primary",
          phoneNumber,
          email,
        },
      });

      const finalPayload = generatePayload(created.id, [created]);
      return res.json({ contact: finalPayload });
    }

    {
      // Check if list has some primary contact
      const primaryContactFound = contacts.find((contact) => contact.linkPrecedence === "primary");
      if (primaryContactFound) {
        // We have found a primary contact, thus it will have all the secondary contacts in it's `linkedTo` part
        const secondaryContacts = await prisma.contact.findMany({
          where: {
            AND: [
              {
                // Find secondary contacts linked to this primary contact
                linkedId: primaryContactFound.id,
              },
              {
                id: {
                  // Do not fetch the already fetched contacts
                  notIn: contacts.map(({ id }) => id),
                },
              },
            ],
          },
        });

        const finalPayload = generatePayload(primaryContactFound.id, [...contacts, ...secondaryContacts]);
        return res.json({ contact: finalPayload });
      }
    }

    // We have found a secondary contact with no primary contact, thus need to fetch the rest using its `linkedId`
    const primaryContactId = contacts[0].linkedId!;
    const secondaryContacts = await prisma.contact.findMany({
      where: {
        OR: [{ id: primaryContactId }, { AND: [{ linkedId: primaryContactId }, { linkedId: { notIn: contacts.map(({ id }) => id) } }] }],
      },
    });

    const finalPayload = generatePayload(primaryContactId, [...contacts, ...secondaryContacts]);
    return res.json({ contact: finalPayload });
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
