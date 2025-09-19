
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { voucherSchema } from "./schema";

const MOCK_VOUCHERS = [
  {
    id: 'v_1',
    voucherNumber: 'PAY-001',
    voucherDate: new Date('2024-07-28'),
    voucherType: 'Payment',
    accountName: 'Office Supplies',
    amount: 5000,
    paymentMode: 'UPI',
    referenceNo: 'UPI-789456123',
    narration: 'Payment for office stationery.',
    status: 'Posted',
    createdBy: 'Admin',
    approvedBy: 'Manager',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'v_2',
    voucherNumber: 'REC-001',
    voucherDate: new Date('2024-07-27'),
    voucherType: 'Receipt',
    accountName: 'Sales - Retail',
    amount: 75000,
    paymentMode: 'Bank Transfer',
    referenceNo: 'BT-54321',
    narration: 'Receipt from customer for vehicle down payment.',
    status: 'Posted',
    createdBy: 'Admin',
    approvedBy: 'Manager',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'v_3',
    voucherNumber: 'JOU-001',
    voucherDate: new Date('2024-07-26'),
    voucherType: 'Journal',
    accountName: 'Depreciation Expense',
    amount: 12000,
    paymentMode: undefined,
    referenceNo: undefined,
    narration: 'Monthly depreciation entry.',
    status: 'Draft',
    createdBy: 'Accountant',
    approvedBy: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'v_4',
    voucherNumber: 'CON-001',
    voucherDate: new Date('2024-07-25'),
    voucherType: 'Contra',
    accountName: 'Cash to Bank',
    amount: 100000,
    paymentMode: 'Cash',
    referenceNo: undefined,
    narration: 'Cash deposited to HDFC account.',
    status: 'Posted',
    createdBy: 'Cashier',
    approvedBy: 'Accountant',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'v_5',
    voucherNumber: 'PAY-002',
    voucherDate: new Date('2024-07-24'),
    voucherType: 'Payment',
    accountName: 'Rent Expense',
    amount: 50000,
    paymentMode: 'Cheque',
    referenceNo: 'CQ-123456',
    narration: 'Monthly office rent.',
    status: 'Cancelled',
    createdBy: 'Admin',
    approvedBy: 'Manager',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let vouchers = [...MOCK_VOUCHERS];

export async function getVouchers() {
  return Promise.resolve(vouchers);
}

export async function addVoucher(
  data: z.infer<typeof voucherSchema>
) {
  const newVoucher = {
    id: `v_${Date.now()}`,
    createdBy: 'Admin', // In a real app, this would be the logged-in user
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  vouchers.push(newVoucher);
  revalidatePath("/dashboard/account/voucher");
  return { success: true, message: "Voucher created successfully." };
}

export async function editVoucher(
  id: string,
  data: z.infer<typeof voucherSchema>
) {
  const index = vouchers.findIndex((v) => v.id === id);
  if (index === -1) {
    return { success: false, message: "Voucher not found." };
  }
  vouchers[index] = { ...vouchers[index], ...data, updatedAt: new Date() };
  revalidatePath("/dashboard/account/voucher");
  return { success: true, message: "Voucher updated successfully." };
}

export async function deleteVoucher(id: string) {
  vouchers = vouchers.filter((v) => v.id !== id);
  revalidatePath("/dashboard/account/voucher");
  return { success: true, message: "Voucher deleted successfully." };
}
