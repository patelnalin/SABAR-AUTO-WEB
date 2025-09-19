
import { z } from "zod";

export const insuranceCompanySchema = z.object({
  companyName: z.string().min(2, "Company name is required."),
  companyCode: z.string().min(2, "Company code is required."),
  registrationNumber: z.string().optional(),
  licenseNumber: z.string().optional(),
  contactPerson: z.string().optional(),
  contactNumber: z.string().regex(/^\d{10}$/, "Must be a 10-digit phone number."),
  email: z.string().email("Invalid email address."),
  website: z.string().url("Invalid URL").optional().or(z.literal('')),
  headOfficeAddress: z.string().min(10, "Address must be at least 10 characters.").optional(),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
  pinCode: z.string().regex(/^\d{6}$/, "Must be a 6-digit PIN code."),
  branchesCount: z.coerce.number().min(0, "Branches count cannot be negative.").optional(),
  servicesOffered: z.array(z.string()).refine(value => value.some(item => item), {
    message: "You have to select at least one service.",
  }),
  status: z.enum(["Active", "Inactive"]),
});
