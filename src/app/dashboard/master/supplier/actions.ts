
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supplierSchema } from "./schema";
import { prisma } from "@/lib/prisma";


export async function getSuppliers() {
  return await prisma.supplier.findMany({
    orderBy: {
      supplierName: 'asc'
    }
  });
}

export async function getSupplierById(id: string) {
    return await prisma.supplier.findUnique({
      where: { id }
    });
}

export async function addSupplier(
  data: z.infer<typeof supplierSchema>
) {
  try {
    await prisma.supplier.create({ data });
    revalidatePath("/dashboard/master/supplier");
    return { success: true, message: "Supplier added successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to add supplier." };
  }
}

export async function editSupplier(
  id: string,
  data: z.infer<typeof supplierSchema>
) {
  try {
    await prisma.supplier.update({ where: { id }, data });
    revalidatePath("/dashboard/master/supplier");
    return { success: true, message: "Supplier updated successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update supplier." };
  }
}

export async function deleteSupplier(id: string) {
  try {
    await prisma.supplier.delete({ where: { id } });
    revalidatePath("/dashboard/master/supplier");
    return { success: true, message: "Supplier deleted successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete supplier." };
  }
}
