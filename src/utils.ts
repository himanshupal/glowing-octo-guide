import type { Contact } from "@prisma/client";
import type { IIdentifyResponse } from "./types";

export const getNumberOrFallback = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const generatePayload = (primaryContactId: number, contacts: Contact[]): IIdentifyResponse["contact"] => {
  const emails = [...new Set(contacts.map(({ email }) => email!))];
  const phoneNumbers = [...new Set(contacts.map(({ phoneNumber }) => phoneNumber!))];
  const secondaryContactIds = [...new Set(contacts.map(({ id }) => id).filter((id) => id !== primaryContactId))];

  return {
    primaryContactId,
    secondaryContactIds,
    phoneNumbers,
    emails,
  };
};
