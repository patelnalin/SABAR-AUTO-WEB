
import { z } from "zod";

export const billProductSchema = z.object({
  productName: z.string().min(1, "Product name is required."),
  qty: z.coerce.number().min(1, "Quantity must be at least 1."),
  rate: z.coerce.number().min(0, "Rate cannot be negative."),
  amount: z.coerce.number().min(0),
});

export const billSchema = z.object({
  billId: z.string().optional(),
  billDate: z.date({ required_error: "Bill date is required." }),
  customerName: z.string().min(2, "Customer name is required."),
  mobile: z.string().regex(/^\d{10}$/, "Must be a 10-digit phone number."),
  village: z.string().min(1, "Village/Town is required."),
  city: z.string().min(1, "City is required."),
  vehicleModel: z.string().min(1, "Vehicle model is required."),
  chassisNo: z.string().min(1, "Chassis number is required."),
  engineNo: z.string().min(1, "Engine number is required."),
  certificateNo: z.string().min(1, "Certificate number is required."),
  meterNo: z.string().optional(),

  // Product Details
  products: z.array(billProductSchema).min(1, "At least one product is required."),

  // Totals
  totalAmount: z.coerce.number().default(0),
  discount: z.coerce.number().default(0),
  sgst: z.coerce.number().default(0),
  cgst: z.coerce.number().default(0),
  grandTotal: z.coerce.number().default(0),
});
