
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { billSchema } from "./schema";
import { MOCK_BILLS } from "./data";

let bills = [...MOCK_BILLS];

export async function getBills() {
    return Promise.resolve(bills);
}

export async function addBill(data: z.infer<typeof billSchema>) {
    const newBill = {
        ...data,
        id: `MB-${String(Date.now()).slice(-5)}`,
        amount: data.grandTotal,
    };
    // @ts-ignore
    bills.push(newBill);
    revalidatePath("/dashboard/account/sales/meetarbill");
    return { success: true, message: "Bill created successfully." };
}
