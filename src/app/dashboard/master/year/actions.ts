
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { financialYearSchema } from "./schema";
import { prisma } from "@/lib/prisma";

// Helper to ensure only one year is active
const enforceSingleActiveYear = async (newYearData: z.infer<typeof financialYearSchema>, idToExclude?: string) => {
    if (newYearData.status === 'Active') {
        const updateData: { where: any, data: any } = {
            where: {
                status: 'Active',
            },
            data: {
                status: 'Inactive',
            },
        };
        if (idToExclude) {
            updateData.where.NOT = {
                id: idToExclude,
            };
        }
        await prisma.financialYear.updateMany(updateData);
    }
};

export async function getFinancialYears() {
  return await prisma.financialYear.findMany({
      orderBy: {
          startDate: 'desc'
      }
  });
}

export async function addFinancialYear(
  data: z.infer<typeof financialYearSchema>
) {
    const existing = await prisma.financialYear.findFirst({ where: { yearName: data.yearName }});
    if (existing) {
        return { success: false, message: "Financial year name must be unique." };
    }
    
    await enforceSingleActiveYear(data);
    
    try {
      await prisma.financialYear.create({ data });
      revalidatePath("/dashboard/master/year");
      return { success: true, message: "Financial year added successfully." };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to add financial year." };
    }
}

export async function editFinancialYear(
  id: string,
  data: z.infer<typeof financialYearSchema>
) {
  const existing = await prisma.financialYear.findFirst({ where: { yearName: data.yearName, NOT: { id } }});
  if (existing) {
        return { success: false, message: "Financial year name must be unique." };
    }

  await enforceSingleActiveYear(data, id);
  
  try {
    await prisma.financialYear.update({ where: { id }, data });
    revalidatePath("/dashboard/master/year");
    return { success: true, message: "Financial year updated successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update financial year." };
  }
}

export async function deleteFinancialYear(id: string) {
  try {
    await prisma.financialYear.delete({ where: { id } });
    revalidatePath("/dashboard/master/year");
    return { success: true, message: "Financial year deleted successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete financial year." };
  }
}
