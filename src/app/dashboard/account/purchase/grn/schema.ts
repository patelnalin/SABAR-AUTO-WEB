
import { z } from "zod";

export const grnItemSchema = z.object({
  id: z.string().optional(),
  modelCode: z.string().min(1, "Model code is required."),
  modelName: z.string(),
  hsnCode: z.string().optional(),
  color: z.string().min(1, "Color is required."),
  chassisNo: z.string().min(1, "Chassis No. is required."),
  engineNo: z.string().min(1, "Engine No. is required."),
  rate: z.coerce.number().min(0, "Rate is required."),
  qty: z.coerce.number().min(1, "Quantity must be at least 1."),
  discount: z.coerce.number().min(0).default(0),
  igst: z.coerce.number().min(0),
  amount: z.coerce.number().min(0),
});

export const grnSchema = z.object({
  // Basic Info
  grnNumber: z.string().optional(),
  grnDate: z.date({ required_error: "GRN Date is required." }),
  poNumber: z.string().min(1, "PO Number is required."),
  branch: z.string().min(1, "Branch is required."),
  supplierName: z.string().min(1, "Supplier Name is required."),
  invoiceNo: z.string().optional(),
  invoiceDate: z.date().optional(),
  truckNo: z.string().optional(),
  lrNo: z.string().optional(),
  
  // Items
  items: z.array(grnItemSchema).min(1, "At least one item is required."),
});

export type GrnItemPayload = z.infer<typeof grnItemSchema>;
export type GrnPayload = z.infer<typeof grnSchema>;
