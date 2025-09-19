
import { z } from "zod";

export const paymentSchema = z.object({
  paymentType: z.enum(["Receipt", "Due Payment", "Advance", "RTO", "Insurance"]),
  paymentDate: z.date({ required_error: "Payment date is required." }),
  customerName: z.string().min(2, "Customer name is required."),
  
  // Vehicle Details
  vehicleModel: z.string().optional(),
  chassisNo: z.string().optional(),
  engineNo: z.string().optional(),
  
  // Payment Information
  amount: z.coerce.number().min(1, "Amount must be greater than zero."),
  paymentMode: z.enum(["Cash", "Bank Transfer", "Credit Card", "UPI", "Cheque"]),
  transactionId: z.string().optional(),
  chequeNumber: z.string().optional(),
  paymentStatus: z.enum(["Pending", "Completed", "Partial", "Failed"]),
  
  // Conditional Fields for RTO/Insurance
  policyOrFileNo: z.string().optional(),
  expiryDate: z.date().optional(),
  companyOrAuthority: z.string().optional(),

  // Other
  invoiceNumber: z.string().min(1, "Invoice/Reference number is required."),
  balanceDue: z.coerce.number().optional(),
  notes: z.string().optional(),
});
