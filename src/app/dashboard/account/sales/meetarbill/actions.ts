
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { billSchema } from "./schema";

export const MOCK_BILLS = [
    {
        id: "MB-001",
        billDate: new Date(),
        customerName: "Rakesh Sharma",
        city: "Pune",
        mobile: "9876543210",
        vehicleModel: "Bajaj RE",
        chassisNo: "CH12345",
        certificateNo: "C-98765",
        meterNo: "M-54321",
        amount: 2500.00,
    },
    {
        id: "MB-002",
        billDate: new Date("2024-07-28"),
        customerName: "Sunita Verma",
        city: "Mumbai",
        mobile: "9123456789",
        vehicleModel: "Bajaj Maxima",
        chassisNo: "CH67890",
        certificateNo: "C-12345",
        meterNo: "M-09876",
        amount: 3200.50,
    }
];

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
