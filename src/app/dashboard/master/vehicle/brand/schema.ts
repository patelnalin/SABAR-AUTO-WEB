
import { z } from "zod";

export const brandSchema = z.object({
  brandName: z.string().min(2, "Brand name must be at least 2 characters."),
  countryOfOrigin: z.string().min(2, "Country of origin is required."),
  establishedYear: z.coerce.number().min(1800, "Year must be after 1800.").max(new Date().getFullYear(), "Year cannot be in the future."),
  headquarterLocation: z.string().optional(),
  status: z.enum(["Active", "Inactive"]),
});
