
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { insuranceSchema } from "./schema";
import { prisma } from "@/lib/prisma";

export async function getInsurancePolicies() {
  return await prisma.insurancePolicy.findMany({
    orderBy: {
        createdAt: 'desc'
    }
  });
}

export async function addInsurancePolicy(
  data: z.infer<typeof insuranceSchema>
) {
  try {
    const newPolicy = await prisma.insurancePolicy.create({
      data: {
        ...data,
        renewalStatus: 'Active', 
      }
    });
    revalidatePath("/dashboard/account/insurance");
    return { success: true, message: "Insurance policy added successfully.", data: newPolicy };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to add insurance policy." };
  }
}

export async function editInsurancePolicy(
  id: string,
  data: z.infer<typeof insuranceSchema>
) {
  try {
    const updatedPolicy = await prisma.insurancePolicy.update({
      where: { id },
      data,
    });
    revalidatePath("/dashboard/account/insurance");
    return { success: true, message: "Policy updated successfully.", data: updatedPolicy };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update policy." };
  }
}

export async function deleteInsurancePolicy(id: string) {
  try {
    await prisma.insurancePolicy.delete({
      where: { id },
    });
    revalidatePath("/dashboard/account/insurance");
    return { success: true, message: "Policy deleted successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete policy." };
  }
}
