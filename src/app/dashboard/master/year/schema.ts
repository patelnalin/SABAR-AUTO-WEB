
import { z } from "zod";

export const financialYearSchema = z.object({
  yearName: z.string().min(1, "Financial year name is required."),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  status: z.enum(["Active", "Inactive"]),
}).refine(data => data.endDate > data.startDate, {
    message: "End date must be after start date.",
    path: ["endDate"],
});
