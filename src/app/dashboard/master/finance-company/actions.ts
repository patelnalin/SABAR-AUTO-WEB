
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { financeCompanySchema } from "./schema";
import { prisma } from "@/lib/prisma";

export async function getFinanceCompanies() {
  return await prisma.financeCompany.findMany({
      orderBy: {
          companyName: 'asc'
      }
  });
}

export async function addFinanceCompany(
  data: z.infer<typeof financeCompanySchema>
) {
  try {
    await prisma.financeCompany.create({ data });
    revalidatePath("/dashboard/master/finance-company");
    return { success: true, message: "Finance company added successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to add finance company." };
  }
}

export async function editFinanceCompany(
  id: string,
  data: z.infer<typeof financeCompanySchema>
) {
  try {
    await prisma.financeCompany.update({ where: { id }, data });
    revalidatePath("/dashboard/master/finance-company");
    return { success: true, message: "Record updated successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update record." };
  }
}

export async function deleteFinanceCompany(id: string) {
  try {
    await prisma.financeCompany.delete({ where: { id } });
    revalidatePath("/dashboard/master/finance-company");
    return { success: true, message: "Record deleted successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete record." };
  }
}

export async function getStates() {
    // In a real app, this would come from a database.
    return Promise.resolve([
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
        "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
        "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", 
        "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ]);
}
