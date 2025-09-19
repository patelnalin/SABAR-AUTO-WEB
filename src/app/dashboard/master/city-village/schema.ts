
import { z } from "zod";

export const cityVillageSchema = z.object({
  village: z.string().min(1, "Village is required."),
  post: z.string().min(1, "Post is required."),
  city: z.string().min(1, "City is required."),
  state: z.string().min(1, "State is required."),
  pincode: z.string().regex(/^\d{6}$/, "Must be a 6-digit PIN code."),
});
