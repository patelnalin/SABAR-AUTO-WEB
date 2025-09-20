
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { paymentSchema } from "./schema";
import { prisma } from "@/lib/prisma";


export async function getPayments() {
  return await prisma.payment.findMany({
      orderBy: {
          paymentDate: 'desc'
      }
  });
}

export async function addPayment(
  data: z.infer<typeof paymentSchema>
) {
  try {
    const newPayment = await prisma.payment.create({
      data: {
        ...data,
        createdBy: 'Admin', // Placeholder for logged-in user
      },
    });
    revalidatePath("/dashboard/account/payment");
    return { success: true, message: "Payment recorded successfully.", data: newPayment };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to record payment." };
  }
}

export async function editPayment(
  id: string,
  data: z.infer<typeof paymentSchema>
) {
  try {
    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      }
    });
    revalidatePath("/dashboard/account/payment");
    return { success: true, message: "Payment updated successfully.", data: updatedPayment };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update payment." };
  }
}

export async function deletePayment(id: string) {
  try {
    await prisma.payment.delete({
      where: { id },
    });
    revalidatePath("/dashboard/account/payment");
    return { success: true, message: "Payment deleted successfully." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete payment." };
  }
}
