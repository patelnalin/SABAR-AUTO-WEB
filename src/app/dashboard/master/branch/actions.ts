
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { branchSchema } from "./schema";

// This is a mock database.
const MOCK_BRANCHES = [
  {
    id: "br_1",
    branchCode: "PUN-KOTH",
    branchName: "Pune Kothrud",
    address: "101, Kothrud Main Rd",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411038",
    phone: "9876543211",
    email: "pune.kothrud@sabar.com",
    managerName: "Suresh Patil",
    openingHours: "9 AM - 8 PM",
    gstin: "27AAACB2442F1Z5",
    bankAccount: "xxxx-xxxx-xxxx-1234",
    activeStatus: true,
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-10"),
  },
  {
    id: "br_2",
    branchCode: "MUM-ANDH",
    branchName: "Mumbai Andheri",
    address: "202, Andheri West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400058",
    phone: "9876543212",
    email: "mumbai.andheri@sabar.com",
    managerName: "Rina Mehta",
    openingHours: "10 AM - 9 PM",
    gstin: "27AAACB2442F1Z6",
    bankAccount: "xxxx-xxxx-xxxx-5678",
    activeStatus: true,
    createdAt: new Date("2022-11-15"),
    updatedAt: new Date("2022-11-15"),
  },
   {
    id: "br_3",
    branchCode: "PUN-VIMN",
    branchName: "Pune Viman Nagar",
    address: "303, Viman Nagar",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411014",
    phone: "9876543213",
    email: "pune.viman@sabar.com",
    managerName: "Ankit Jain",
    openingHours: "9 AM - 8 PM",
    gstin: "27AAACB2442F1Z7",
    bankAccount: "xxxx-xxxx-xxxx-9012",
    activeStatus: false,
    createdAt: new Date("2023-05-01"),
    updatedAt: new Date("2023-05-01"),
  },
];

let branches = [...MOCK_BRANCHES];

export async function getBranches() {
  return Promise.resolve(branches);
}

export async function addBranch(
  data: z.infer<typeof branchSchema>
) {
  const newBranch = {
    id: `br_${Date.now()}`,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  branches.push(newBranch);
  revalidatePath("/dashboard/master/branch");
  return { success: true, message: "Branch added successfully." };
}

export async function editBranch(
  id: string,
  data: z.infer<typeof branchSchema>
) {
  const index = branches.findIndex((b) => b.id === id);
  if (index === -1) {
    return { success: false, message: "Branch not found." };
  }
  branches[index] = { ...branches[index], ...data, updatedAt: new Date() };
  revalidatePath("/dashboard/master/branch");
  return { success: true, message: "Branch updated successfully." };
}

export async function deleteBranch(id: string) {
  branches = branches.filter((b) => b.id !== id);
  revalidatePath("/dashboard/master/branch");
  return { success: true, message: "Branch deleted successfully." };
}
