
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { modelSchema } from "./schema";
import { prisma } from "@/lib/prisma";
import { getBrands } from "../brand/actions";


export async function getVehicleBrandNames() {
    const brands = await getBrands();
    return brands.map(brand => brand.brandName);
}

export async function getModels() {
  return await prisma.model.findMany({
    orderBy: {
      modelName: 'asc'
    }
  });
}

export async function addModel(
  data: z.infer<typeof modelSchema>
) {
  try {
    await prisma.model.create({ data });
    revalidatePath("/dashboard/master/vehicle/model");
    return { success: true, message: "Model added successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to add model." };
  }
}

export async function editModel(
  id: string,
  data: z.infer<typeof modelSchema>
) {
  try {
    await prisma.model.update({ where: { id }, data });
    revalidatePath("/dashboard/master/vehicle/model");
    return { success: true, message: "Model updated successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update model." };
  }
}

export async function deleteModel(id: string) {
  try {
    await prisma.model.delete({ where: { id } });
    revalidatePath("/dashboard/master/vehicle/model");
    return { success: true, message: "Model deleted successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete model." };
  }
}
