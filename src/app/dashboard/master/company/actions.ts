
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { companySchema } from "./schema";
import { prisma } from "@/lib/prisma";


export async function getCompanies() {
  return await prisma.company.findMany({
      orderBy: {
          companyName: 'asc'
      }
  });
}

export async function getCompanyById(id: string) {
    return await prisma.company.findUnique({
      where: { id }
    });
}

export async function addCompany(
  data: z.infer<typeof companySchema>
) {
  try {
    await prisma.company.create({ data });
    revalidatePath("/dashboard/master/company");
    return { success: true, message: "Company added successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to add company." };
  }
}

export async function editCompany(
  id: string,
  data: z.infer<typeof companySchema>
) {
  try {
    await prisma.company.update({
      where: { id },
      data
    });
    revalidatePath("/dashboard/master/company");
    return { success: true, message: "Company updated successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update company." };
  }
}

export async function deleteCompany(id: string) {
  try {
    await prisma.company.delete({
      where: { id }
    });
    revalidatePath("/dashboard/master/company");
    return { success: true, message: "Company deleted successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete company." };
  }
}
