
import { z } from "zod";

export const financeCompanySchema = z.object({
  // Basic Information
  companyName: z.string().min(2, "Company name is required."),
  registrationNumber: z.string().optional(),
  licenseType: z.enum(["NBFC", "Microfinance", "Cooperative", "Other"]),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format.").optional().or(z.literal("")),
  gstNumber: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format.").optional().or(z.literal("")),
  incorporationDate: z.date().optional(),

  // Contact Information
  contactPersonName: z.string().optional(),
  contactPersonDesignation: z.string().optional(),
  mobileNumber: z.string().regex(/^\d{10}$/, "Must be a 10-digit mobile number."),
  alternatePhoneNumber: z.string().optional(),
  email: z.string().email("Invalid email address."),
  website: z.string().url("Invalid URL").optional().or(z.literal('')),

  // Address Details
  headOfficeAddress: z.string().min(10, "Address must be at least 10 characters."),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
  pinCode: z.string().regex(/^\d{6}$/, "Must be a 6-digit PIN code."),
  country: z.string().default("India"),

  // Other Details
  branchCount: z.coerce.number().min(0, "Branches count cannot be negative.").optional(),
  status: z.enum(["Active", "Inactive"]),
  notes: z.string().optional(),
});
