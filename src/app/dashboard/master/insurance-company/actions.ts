
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { insuranceCompanySchema } from "./schema";
import { prisma } from "@/lib/prisma";


export async function getInsuranceCompanies() {
  const companies = await prisma.insuranceCompany.findMany({
      orderBy: {
          companyName: 'asc'
      }
  });

  return companies.map(company => ({
      ...company,
      servicesOffered: company.servicesOffered.split(',').filter(s => s),
  }));
}

export async function getInsuranceCompanyById(id: string) {
    const company = await prisma.insuranceCompany.findUnique({
      where: { id }
    });
     if (!company) return null;

    return {
      ...company,
      servicesOffered: company.servicesOffered.split(',').filter(s => s),
    };
}


export async function addInsuranceCompany(
  data: z.infer<typeof insuranceCompanySchema>
) {
  const dataWithServicesAsString = {
    ...data,
    servicesOffered: data.servicesOffered.join(','),
  };

  try {
    await prisma.insuranceCompany.create({ data: dataWithServicesAsString });
    revalidatePath("/dashboard/master/insurance-company");
    return { success: true, message: "Insurance company added successfully." };
  } catch (error) {
    if ((error as any).code === 'P2002' && (error as any).meta?.target?.includes('companyCode')) {
      return { success: false, message: "Company code must be unique." };
    }
    console.error(error);
    return { success: false, message: "Failed to add insurance company." };
  }
}

export async function editInsuranceCompany(
  id: string,
  data: z.infer<typeof insuranceCompanySchema>
) {
  const dataWithServicesAsString = {
    ...data,
    servicesOffered: data.servicesOffered.join(','),
  };

  try {
    await prisma.insuranceCompany.update({ where: { id }, data: dataWithServicesAsString });
    revalidatePath("/dashboard/master/insurance-company");
    return { success: true, message: "Record updated successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update record." };
  }
}

export async function deleteInsuranceCompany(id: string) {
  try {
    await prisma.insuranceCompany.delete({ where: { id } });
    revalidatePath("/dashboard/master/insurance-company");
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
