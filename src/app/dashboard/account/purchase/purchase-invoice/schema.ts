
import { z } from "zod";

export const invoiceLineItemSchema = z.object({
  id: z.string().optional(),
  modelCode: z.string().min(1, "Model code is required."),
  modelName: z.string().min(1, "Model name is required."),
  hsnCode: z.string().optional(),
  color: z.string().min(1, "Color is required."),
  chassisNumber: z.string().min(1, "Chassis number is required."),
  engineNumber: z.string().min(1, "Engine number is required."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  rate: z.coerce.number().min(0, "Rate cannot be negative."),
  discount: z.coerce.number().min(0).max(100).default(0),
  amount: z.coerce.number().min(0),
});

export const invoiceSchema = z.object({
  // Header
  invoiceNumber: z.string().min(1, "Invoice number is required."),
  invoiceDate: z.date(),
  supplierName: z.string().min(1, "Supplier is required."),
  poNumber: z.string().optional(),
  branch: z.string().min(1, "Branch is required."),
  grnNumber: z.string().optional(),
  contactPerson: z.string().optional(),
  
  // Payment & Delivery
  paymentTerms: z.string().min(1, "Payment terms are required."),
  deliveryAddress: z.string().min(1, "Delivery address is required."),
  currency: z.enum(["INR", "USD", "EUR"]),
  status: z.enum(["Draft", "Pending Approval", "Approved", "Paid", "Cancelled"]),

  // Line Items
  lineItems: z.array(invoiceLineItemSchema).min(1, "At least one line item is required."),

  // Footer
  subtotal: z.coerce.number(),
  totalDiscount: z.coerce.number(),
  sgst: z.coerce.number(),
  cgst: z.coerce.number(),
  shippingCharges: z.coerce.number().default(0),
  grandTotal: z.coerce.number(),
});

export type InvoiceLineItem = z.infer<typeof invoiceLineItemSchema>;
export type InvoicePayload = z.infer<typeof invoiceSchema>;

    
