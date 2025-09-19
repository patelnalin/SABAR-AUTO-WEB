
import { z } from "zod";

export const insuranceSchema = z.object({
  policyNumber: z.string().min(1, "Policy number is required."),
  policyType: z.enum(["Health", "Vehicle", "Life", "Fire", "Travel", "Other"]),
  insuranceCompany: z.string().min(2, "Insurance company is required."),
  policyHolderName: z.string().min(2, "Policy holder name is required."),
  phoneNumber: z.string().regex(/^\d{10}$/, "Must be a 10-digit phone number."),
  email: z.string().email("Invalid email address.").optional().or(z.literal('')),
  startDate: z.date({ required_error: "Start date is required." }),
  endDate: z.date({ required_error: "End date is required." }),
  premiumAmount: z.coerce.number().min(1, "Premium amount is required."),
  sumInsured: z.coerce.number().optional(),
  paymentMode: z.enum(["Cash", "Bank Transfer", "UPI", "Credit Card", "Cheque"]),
  agentName: z.string().optional(),
  renewalReminderDate: z.date().optional(),
  notes: z.string().optional(),
  status: z.enum(["Active", "Inactive"]),
}).refine(data => data.endDate > data.startDate, {
  message: "End date must be after start date.",
  path: ["endDate"],
});
