
import { z } from "zod";

export const companySchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters."),
  registrationNumber: z.string().min(5, "Registration number is required."),
  gstNumber: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST Number format.").optional().or(z.literal("")),
  industryType: z.enum(["IT", "Manufacturing", "Finance", "Healthcare", "Other"]),
  address: z.string().min(5, "Address is required."),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
  country: z.string().min(2, "Country is required."),
  pincode: z.string().regex(/^\d{6}$/, "Must be a 6-digit PIN code."),
  email: z.string().email("Invalid email address."),
  phone: z.string().regex(/^\d{10}$/, "Must be a 10-digit phone number."),
  website: z.string().url("Invalid URL.").optional().or(z.literal("")),
});
