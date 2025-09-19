
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { financialYearSchema } from "./schema";

// This is a mock database.
const MOCK_YEARS = [
    {
        id: "fy_1",
        yearName: "2024-2025",
        startDate: new Date("2024-04-01"),
        endDate: new Date("2025-03-31"),
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "fy_2",
        yearName: "2023-2024",
        startDate: new Date("2023-04-01"),
        endDate: new Date("2024-03-31"),
        status: "Inactive",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

let financialYears = [...MOCK_YEARS];

// Helper to ensure only one year is active
const enforceSingleActiveYear = (newYear: z.infer<typeof financialYearSchema>, idToExclude?: string) => {
    if (newYear.status === 'Active') {
        financialYears = financialYears.map(year => {
            if (year.id !== idToExclude) {
                return { ...year, status: 'Inactive' as 'Inactive' };
            }
            return year;
        });
    }
};

export async function getFinancialYears() {
  return Promise.resolve(financialYears);
}

export async function addFinancialYear(
  data: z.infer<typeof financialYearSchema>
) {
    if (financialYears.some(year => year.yearName === data.yearName)) {
        return { success: false, message: "Financial year name must be unique." };
    }
    
    enforceSingleActiveYear(data);
    
    const newYear = {
        id: `fy_${Date.now()}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    financialYears.push(newYear);
    revalidatePath("/dashboard/master/year");
    return { success: true, message: "Financial year added successfully." };
}

export async function editFinancialYear(
  id: string,
  data: z.infer<typeof financialYearSchema>
) {
  const index = financialYears.findIndex((y) => y.id === id);
  if (index === -1) {
    return { success: false, message: "Financial year not found." };
  }

  if (financialYears.some(year => year.yearName === data.yearName && year.id !== id)) {
        return { success: false, message: "Financial year name must be unique." };
    }

  enforceSingleActiveYear(data, id);
  
  financialYears[index] = { ...financialYears[index], ...data, updatedAt: new Date() };
  revalidatePath("/dashboard/master/year");
  return { success: true, message: "Financial year updated successfully." };
}

export async function deleteFinancialYear(id: string) {
  financialYears = financialYears.filter((y) => y.id !== id);
  revalidatePath("/dashboard/master/year");
  return { success: true, message: "Financial year deleted successfully." };
}
