
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { colorSchema } from "./schema";
import { prisma } from "@/lib/prisma";


export async function getColors() {
  return await prisma.color.findMany({
    orderBy: {
      colorName: 'asc'
    }
  });
}

export async function addColor(
  data: z.infer<typeof colorSchema>
) {
  try {
    await prisma.color.create({ data });
    revalidatePath("/dashboard/master/vehicle/color");
    return { success: true, message: "Color added successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to add color." };
  }
}

export async function editColor(
  id: string,
  data: z.infer<typeof colorSchema>
) {
  try {
    await prisma.color.update({ where: { id }, data });
    revalidatePath("/dashboard/master/vehicle/color");
    return { success: true, message: "Color updated successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update color." };
  }
}

export async function deleteColor(id: string) {
  try {
    await prisma.color.delete({ where: { id } });
    revalidatePath("/dashboard/master/vehicle/color");
    return { success: true, message: "Color deleted successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete color." };
  }
}
