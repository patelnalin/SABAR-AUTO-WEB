
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supplierSchema } from "./schema";

// This is a mock database.
const MOCK_SUPPLIERS = [
  {
    id: "sup_1",
    supplierName: "Reliable Auto Parts",
    contactPerson: "Mr. Verma",
    email: "contact@reliableauto.com",
    phone: "9876543210",
    address: "123, Auto Market",
    city: "Delhi",
    state: "Delhi",
    pincode: "110006",
    gstin: "07AABCU9603R1Z4",
    status: "Active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sup_2",
    supplierName: "Bharat Tyres",
    contactPerson: "Mr. Singh",
    email: "sales@bharattyres.com",
    phone: "9123456789",
    address: "456, Tyre Gali",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    gstin: "27AAACB2442F1Z5",
    status: "Active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
   {
    id: "sup_3",
    supplierName: "Engine Masters",
    contactPerson: "Mr. Khan",
    email: "info@enginemasters.com",
    phone: "8877665544",
    address: "789, Industrial Area",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411001",
    gstin: "27AAACB2442F1Z6",
    status: "Inactive",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

let suppliers = [...MOCK_SUPPLIERS];

export async function getSuppliers() {
  return Promise.resolve(suppliers);
}

export async function getSupplierById(id: string) {
    return Promise.resolve(suppliers.find((s) => s.id === id));
}

export async function addSupplier(
  data: z.infer<typeof supplierSchema>
) {
  const newSupplier = {
    id: `sup_${Date.now()}`,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  suppliers.push(newSupplier);
  revalidatePath("/dashboard/master/supplier");
  return { success: true, message: "Supplier added successfully." };
}

export async function editSupplier(
  id: string,
  data: z.infer<typeof supplierSchema>
) {
  const index = suppliers.findIndex((s) => s.id === id);
  if (index === -1) {
    return { success: false, message: "Supplier not found." };
  }
  suppliers[index] = { ...suppliers[index], ...data, id: suppliers[index].id, createdAt: suppliers[index].createdAt, updatedAt: new Date() };
  revalidatePath("/dashboard/master/supplier");
  return { success: true, message: "Supplier updated successfully." };
}

export async function deleteSupplier(id: string) {
  suppliers = suppliers.filter((s) => s.id !== id);
  revalidatePath("/dashboard/master/supplier");
  return { success: true, message: "Supplier deleted successfully." };
}
