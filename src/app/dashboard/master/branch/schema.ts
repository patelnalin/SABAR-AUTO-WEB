
import { z } from "zod";

export const branchSchema = z.object({
  branchCode: z.string().min(1, "Branch code is required."),
  branchName: z.string().min(2, "Branch name is required."),
  address: z.string().min(5, "Address is required."),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
  pincode: z.string().regex(/^\d{6}$/, "Must be a 6-digit PIN code."),
  phone: z.string().regex(/^\d{10}$/, "Must be a 10-digit phone number."),
  email: z.string().email("Invalid email address."),
  managerName: z.string().optional(),
  openingHours: z.string().optional(),
  gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format.").optional().or(z.literal("")),
  bankAccount: z.string().optional(),
  activeStatus: z.boolean().default(true),
});
