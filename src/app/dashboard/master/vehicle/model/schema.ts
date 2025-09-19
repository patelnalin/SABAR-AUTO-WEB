
import { z } from "zod";

export const modelSchema = z.object({
  modelCode: z.string().min(1, "Model code is required."),
  modelName: z.string().min(2, "Model name must be at least 2 characters."),
  brandName: z.string().min(1, "Brand name is required."),
  fuelType: z.enum(["Petrol", "Diesel", "CNG", "Electric", "Hybrid"]),
  seatingCapacity: z.coerce.number().min(1, "Seating capacity must be at least 1.").optional(),
  engineCapacity: z.coerce.number().min(50, "Engine capacity must be at least 50cc.").optional(),
  transmissionType: z.enum(["Manual", "Automatic", "AMT", "CVT", "DCT"]),
  priceRange: z.string().optional(),
  launchYear: z.coerce.number().min(1980, "Year must be after 1980.").max(new Date().getFullYear() + 1, "Year cannot be too far in the future."),
  status: z.enum(["Active", "Inactive"]),
});
