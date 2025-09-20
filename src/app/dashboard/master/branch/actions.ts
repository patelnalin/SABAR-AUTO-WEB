
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { branchSchema } from "./schema";
import { prisma } from "@/lib/prisma";

export async function getBranches() {
  return await prisma.branch.findMany({
      orderBy: {
          branchName: 'asc'
      }
  });
}

export async function getBranchById(id: string) {
    return await prisma.branch.findUnique({
      where: { id }
    });
}

export async function addBranch(
  data: z.infer<typeof branchSchema>
) {
  try {
    const newBranch = await prisma.branch.create({
      data
    });
    revalidatePath("/dashboard/master/branch");
    return { success: true, message: "Branch added successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to add branch." };
  }
}

export async function editBranch(
  id: string,
  data: z.infer<typeof branchSchema>
) {
  try {
    await prisma.branch.update({
      where: { id },
      data
    });
    revalidatePath("/dashboard/master/branch");
    return { success: true, message: "Branch updated successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update branch." };
  }
}

export async function deleteBranch(id: string) {
  try {
    await prisma.branch.delete({
      where: { id }
    });
    revalidatePath("/dashboard/master/branch");
    return { success: true, message: "Branch deleted successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete branch." };
  }
}
