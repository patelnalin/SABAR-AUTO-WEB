
import { z } from "zod";
import { billSchema } from "./schema";

export const MOCK_BILLS: (z.infer<typeof billSchema> & {id: string, amount: number})[] = [
    {
        id: "MB-001",
        billId: "MB-001",
        billDate: new Date(),
        customerName: "Rakesh Sharma",
        city: "Pune",
        mobile: "9876543210",
        vehicleModel: "Bajaj RE",
        chassisNo: "CH12345",
        engineNo: "EN12345",
        certificateNo: "C-98765",
        meterNo: "M-54321",
        products: [{ productName: "Meter Assembly", qty: 1, rate: 2200, amount: 2200 }],
        totalAmount: 2200,
        discount: 0,
        sgst: 198,
        cgst: 198,
        grandTotal: 2596,
        amount: 2596,
        village: "Kothrud",
    },
    {
        id: "MB-002",
        billId: "MB-002",
        billDate: new Date("2024-07-28"),
        customerName: "Sunita Verma",
        city: "Mumbai",
        mobile: "9123456789",
        vehicleModel: "Bajaj Maxima",
        chassisNo: "CH67890",
        engineNo: "EN67890",
        certificateNo: "C-12345",
        meterNo: "M-09876",
        products: [{ productName: "Meter Repair", qty: 1, rate: 3000, amount: 3000 }],
        totalAmount: 3000,
        discount: 100,
        sgst: 261,
        cgst: 261,
        grandTotal: 3422,
        amount: 3422,
        village: "Andheri",
    }
];
