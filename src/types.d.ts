import type { z } from "zod";
import type { contactBaseSchema } from "./schema";

export interface IIdentifyResponse {
  contact: {
    primaryContactId: number;
    emails: string[]; // first element being email of primary contact
    phoneNumbers: string[]; // first element being phoneNumber of primary contact
    secondaryContactIds: number[]; // Array of all Contact IDs that are "secondary" to the primary contact
  };
}

export type RequestType = z.infer<typeof contactBaseSchema>;
