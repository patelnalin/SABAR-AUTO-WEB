
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { cityVillageSchema } from "./schema";
import { prisma } from "@/lib/prisma";


export async function getAddresses() {
  return await prisma.address.findMany({
    orderBy: {
      city: 'asc'
    }
  });
}

export async function addAddress(
  data: z.infer<typeof cityVillageSchema>
) {
  try {
    await prisma.address.create({
      data
    });
    revalidatePath("/dashboard/master/city-village");
    return { success: true, message: "Address added successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to add address." };
  }
}

export async function editAddress(
  id: string,
  data: z.infer<typeof cityVillageSchema>
) {
  try {
    await prisma.address.update({
      where: { id },
      data
    });
    revalidatePath("/dashboard/master/city-village");
    return { success: true, message: "Record updated successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update record." };
  }
}

export async function deleteAddress(id: string) {
  try {
    await prisma.address.delete({
      where: { id }
    });
    revalidatePath("/dashboard/master/city-village");
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
