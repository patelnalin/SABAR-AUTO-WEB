
import { z } from "zod";

export const poLineItemSchema = z.object({
  id: z.string().optional(),
  modelCode: z.string().min(1, "Model code is required."),
  modelName: z.string().min(1, "Model name is required."),
  color: z.string().min(1, "Color is required."),
  hsnCode: z.string().optional(),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  rate: z.coerce.number().min(0, "Rate cannot be negative."),
  discount: z.coerce.number().min(0).max(100).default(0),
  amount: z.coerce.number().min(0),
});

export const poSchema = z.object({
  // Header
  poNumber: z.string().optional(),
  poDate: z.date(),
  branch: z.string().min(1, "Branch is required"),
  supplierName: z.string().min(1, "Supplier is required."),
  invoiceNo: z.string().optional(),
  invoiceDate: z.date().optional(),
  withWithoutForm: z.enum(["With Form", "Without Form"]).optional(),
  
  // Delivery
  transporter: z.string().optional(),
  truckNo: z.string().optional(),
  mobileNo: z.string().optional(),
  billAmt: z.coerce.number().optional(),

  // Line Items
  lineItems: z.array(poLineItemSchema).min(1, "At least one line item is required."),

  // Footer - These will be calculated
  subtotal: z.coerce.number().optional(),
  sgst: z.coerce.number().optional(),
  cgst: z.coerce.number().optional(),
  grandTotal: z.coerce.number().optional(),
});

export type PurchaseOrderLineItem = z.infer<typeof poLineItemSchema>;
export type PurchaseOrderPayload = z.infer<typeof poSchema>;
