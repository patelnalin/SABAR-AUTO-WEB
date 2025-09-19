
import { z } from "zod";

export const supplierSchema = z.object({
  supplierName: z.string().min(2, "Supplier name is required."),
  contactPerson: z.string().optional(),
  email: z.string().email("Invalid email address."),
  phone: z.string().regex(/^\d{10}$/, "Must be a 10-digit phone number."),
  address: z.string().min(5, "Address is required."),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
  pincode: z.string().regex(/^\d{6}$/, "Must be a 6-digit PIN code."),
  gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format.").optional().or(z.literal("")),
  status: z.enum(["Active", "Inactive"]),
});
