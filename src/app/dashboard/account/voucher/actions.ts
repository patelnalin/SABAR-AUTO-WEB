
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { voucherSchema } from "./schema";
import { prisma } from "@/lib/prisma";

export async function getVouchers() {
  return await prisma.voucher.findMany({
      orderBy: {
          voucherDate: 'desc'
      }
  });
}

export async function addVoucher(
  data: z.infer<typeof voucherSchema>
) {
  try {
    const newVoucher = await prisma.voucher.create({
      data: {
        ...data,
        createdBy: 'Admin', // In a real app, this would be the logged-in user
      }
    });
    revalidatePath("/dashboard/account/voucher");
    return { success: true, message: "Voucher created successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to create voucher." };
  }
}

export async function editVoucher(
  id: string,
  data: z.infer<typeof voucherSchema>
) {
  try {
    await prisma.voucher.update({
      where: { id },
      data
    });
    revalidatePath("/dashboard/account/voucher");
    return { success: true, message: "Voucher updated successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update voucher." };
  }
}

export async function deleteVoucher(id: string) {
  try {
    await prisma.voucher.delete({
      where: { id }
    });
    revalidatePath("/dashboard/account/voucher");
    return { success: true, message: "Voucher deleted successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete voucher." };
  }
}
