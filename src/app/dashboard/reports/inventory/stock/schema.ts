
import { z } from "zod";

export const vehicleStockSchema = z.object({
  id: z.string(),
  creationDate: z.date(),
  poNumber: z.string(),
  poInvoiceDate: z.date().optional(),
  modelCode: z.string(),
  modelName: z.string(),
  colorCode: z.string().optional(),
  color: z.string(),
  poInvoiceNo: z.string(),
  chassisNo: z.string(),
  engineNo: z.string(),
  status: z.enum(["In Stock", "Sold", "Reserved", "In Transit"]),
  batteryNo: z.string().optional(),
  supplierName: z.string(),
  cost: z.number(),
});

export type VehicleStock = z.infer<typeof vehicleStockSchema>;
