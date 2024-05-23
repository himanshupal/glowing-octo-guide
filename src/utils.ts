import type { Contact, PrismaClient } from "@prisma/client";
import type { IIdentifyResponse, RequestType } from "./types";

export const getNumberOrFallback = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const generatePayloadCreatingContactAsRequired = async (
  primaryContactId: number,
  contacts: Contact[],
  prisma: PrismaClient,
  req: RequestType,
): Promise<IIdentifyResponse["contact"]> => {
  const emails = [...new Set(contacts.map(({ email }) => email!))];
  const phoneNumbers = [...new Set(contacts.map(({ phoneNumber }) => phoneNumber!))];
  const secondaryContactIds = [...new Set(contacts.map(({ id }) => id).filter((id) => id !== primaryContactId))];

  // Found a new `phoneNumber`, create new secondary contact
  const newPhoneNumberFound = !!(req.phoneNumber && !phoneNumbers.includes(req.phoneNumber));

  // Found a new `email`, create new secondary contact
  const newEmailFound = !!(req.email && !emails.includes(req.email));

  if (newEmailFound || newPhoneNumberFound) {
    const newSecondaryContact = await prisma.contact.create({
      data: {
        ...req,
        linkPrecedence: "secondary",
        linkedId: primaryContactId,
      },
    });

    // Push the new contact ID to the list
    secondaryContactIds.push(newSecondaryContact.id);

    if (newPhoneNumberFound) phoneNumbers.push(req.phoneNumber!);
    if (newEmailFound) emails.push(req.email!);
  }

  return {
    primaryContactId,
    secondaryContactIds,
    phoneNumbers,
    emails,
  };
};
