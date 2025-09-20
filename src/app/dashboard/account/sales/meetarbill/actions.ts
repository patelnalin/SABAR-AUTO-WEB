
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { billSchema } from "./schema";
import { prisma } from "@/lib/prisma";

export async function getBills() {
    return await prisma.meetarBill.findMany({
        orderBy: {
            billDate: 'desc'
        },
        include: {
            products: true
        }
    });
}

export async function addBill(data: z.infer<typeof billSchema>) {
    const { products, ...billData } = data;
    try {
        const newBill = await prisma.meetarBill.create({
            data: {
                ...billData,
                amount: data.grandTotal, // Set amount to grandTotal
                products: {
                    create: products.map(p => ({...p}))
                }
            },
        });
        revalidatePath("/dashboard/account/sales/meetarbill");
        return { success: true, message: "Bill created successfully." };
    } catch (e) {
        console.error(e);
        return { success: false, message: "Failed to create bill." };
    }
}
