
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { paymentSchema } from "./schema";

const MOCK_PAYMENTS = [
  {
    id: 'pay_1',
    paymentType: 'Receipt',
    paymentDate: new Date('2024-07-11'),
    customerName: 'Reliable Auto Parts',
    vehicleModel: 'Pulsar NS200',
    chassisNo: 'CHNS200R001',
    engineNo: 'ENNS200R001',
    amount: 150000,
    paymentMode: 'Bank Transfer',
    transactionId: 'BT-987654',
    paymentStatus: 'Completed',
    invoiceNumber: 'INV-2024-07-001',
    balanceDue: 0,
    notes: 'Full payment received against invoice.',
    createdBy: 'Admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'pay_2',
    paymentType: 'Advance',
    paymentDate: new Date('2024-07-20'),
    customerName: 'Bharat Tyres',
    vehicleModel: 'Dominar 400',
    chassisNo: 'CHD400G001',
    engineNo: 'END400G001',
    amount: 50000,
    paymentMode: 'Cheque',
    chequeNumber: '123456',
    paymentStatus: 'Pending',
    invoiceNumber: 'BOOK-2024-07-002',
    balanceDue: 225000,
    notes: 'Advance booking payment.',
    createdBy: 'Admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'pay_3',
    paymentType: 'Insurance',
    paymentDate: new Date('2024-07-25'),
    customerName: 'Engine Masters',
    vehicleModel: 'Chetak Electric',
    chassisNo: 'CHCETAKW001',
    engineNo: 'ENCETAKW001',
    amount: 8500,
    paymentMode: 'UPI',
    transactionId: 'UPI-123456',
    paymentStatus: 'Completed',
    invoiceNumber: 'INS-2024-07-003',
    policyOrFileNo: 'POL-HDFC-9876',
    expiryDate: new Date('2025-07-24'),
    companyOrAuthority: 'HDFC ERGO',
    notes: 'First year insurance premium.',
    createdBy: 'UserX',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
   {
    id: 'pay_4',
    paymentType: 'RTO',
    paymentDate: new Date('2024-07-12'),
    customerName: 'Reliable Auto Parts',
    vehicleModel: 'Pulsar NS200',
    chassisNo: 'CHNS200R001',
    engineNo: 'ENNS200R001',
    amount: 12000,
    paymentMode: 'Cash',
    paymentStatus: 'Completed',
    invoiceNumber: 'RTO-2024-07-001',
    policyOrFileNo: 'MH1220240012345',
    companyOrAuthority: 'Pune RTO',
    notes: 'RTO tax and registration charges.',
    createdBy: 'Manager',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// @ts-ignore
let payments = [...MOCK_PAYMENTS];

export async function getPayments() {
  return Promise.resolve(payments);
}

export async function addPayment(
  data: z.infer<typeof paymentSchema>
) {
  const newPayment = {
    id: `pay_${Date.now()}`,
    createdBy: 'Admin',
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  // @ts-ignore
  payments.push(newPayment);
  revalidatePath("/dashboard/account/payment");
  return { success: true, message: "Payment recorded successfully." };
}

export async function editPayment(
  id: string,
  data: z.infer<typeof paymentSchema>
) {
  const index = payments.findIndex((p) => p.id === id);
  if (index === -1) {
    return { success: false, message: "Payment not found." };
  }
  payments[index] = { ...payments[index], ...data, updatedAt: new Date() };
  revalidatePath("/dashboard/account/payment");
  return { success: true, message: "Payment updated successfully." };
}

export async function deletePayment(id: string) {
  payments = payments.filter((p) => p.id !== id);
  revalidatePath("/dashboard/account/payment");
  return { success: true, message: "Payment deleted successfully." };
}
