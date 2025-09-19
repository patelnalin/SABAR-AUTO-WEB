
import { z } from "zod";

export const colorSchema = z.object({
  colorName: z.string().min(2, "Color name must be at least 2 characters."),
  colorCode: z.string().optional(),
  finishType: z.enum(["Solid", "Metallic", "Matte", "Pearl", "Dual-Tone"]),
  status: z.enum(["Active", "Inactive"]),
});
