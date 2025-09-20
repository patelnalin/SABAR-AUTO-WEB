
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { brandSchema } from "./schema";
import { prisma } from "@/lib/prisma";


export async function getBrands() {
  return await prisma.brand.findMany({
    orderBy: {
      brandName: 'asc'
    }
  });
}

export async function getBrandById(id: string) {
    return await prisma.brand.findUnique({
        where: { id }
    });
}

export async function addBrand(
  data: z.infer<typeof brandSchema>
) {
  try {
    await prisma.brand.create({ data });
    revalidatePath("/dashboard/master/vehicle/brand");
    return { success: true, message: "Brand added successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to add brand." };
  }
}

export async function editBrand(
  id: string,
  data: z.infer<typeof brandSchema>
) {
  try {
    await prisma.brand.update({ where: { id }, data });
    revalidatePath("/dashboard/master/vehicle/brand");
    return { success: true, message: "Brand updated successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update brand." };
  }
}

export async function deleteBrand(id: string) {
  try {
    await prisma.brand.delete({ where: { id } });
    revalidatePath("/dashboard/master/vehicle/brand");
    return { success: true, message: "Brand deleted successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete brand." };
  }
}
