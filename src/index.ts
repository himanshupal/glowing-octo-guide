import express from "express";
import { getNumberOrFallback } from "./utils";
import { PrismaClient } from "@prisma/client";

const server = express();

server.use(express.json());
const port = getNumberOrFallback(process.env.PORT, 8000);
const prisma = new PrismaClient();

server.get("/", (_req, res) => res.sendStatus(200));

server.get("/contacts", async (_req, res) => {
  return res.json({ contacts: await prisma.contact.findMany() });
});

server.listen({ port }, () => {
  console.log(`Server started on port: ${port}`);
});