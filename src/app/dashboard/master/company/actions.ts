
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { companySchema } from "./schema";

// This is a mock database. In a real application, you would use a database
// like PostgreSQL with an ORM like Prisma.
const MOCK_COMPANIES = [
  {
    id: "co_1",
    companyName: "Innovate Inc.",
    registrationNumber: "U74999DL2015PTC288636",
    gstNumber: "07AABCU9603R1ZM",
    industryType: "IT",
    address: "123 Tech Park",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    pincode: "560001",
    email: "contact@innovate.com",
    phone: "9876543210",
    website: "https://innovate.com",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
  {
    id: "co_2",
    companyName: "AutoCrafters Ltd.",
    registrationNumber: "U34100MH2010PLC204369",
    gstNumber: "27AAACB2442F1Z5",
    industryType: "Manufacturing",
    address: "456 Industrial Estate",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    pincode: "411001",
    email: "info@autocrafters.com",
    phone: "9123456789",
    website: "https://autocrafters.com",
    createdAt: new Date("2022-05-20"),
    updatedAt: new Date("2022-05-20"),
  },
];

let companies = [...MOCK_COMPANIES];

export async function getCompanies() {
  // In a real app, you'd fetch this from your database.
  return Promise.resolve(companies);
}

export async function addCompany(
  data: z.infer<typeof companySchema>
) {
  const newCompany = {
    id: `co_${Date.now()}`,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  companies.push(newCompany);
  revalidatePath("/dashboard/master/company");
  return { success: true, message: "Company added successfully." };
}

export async function editCompany(
  id: string,
  data: z.infer<typeof companySchema>
) {
  const index = companies.findIndex((c) => c.id === id);
  if (index === -1) {
    return { success: false, message: "Company not found." };
  }
  companies[index] = { ...companies[index], ...data, updatedAt: new Date() };
  revalidatePath("/dashboard/master/company");
  return { success: true, message: "Company updated successfully." };
}

export async function deleteCompany(id: string) {
  companies = companies.filter((c) => c.id !== id);
  revalidatePath("/dashboard/master/company");
  return { success: true, message: "Company deleted successfully." };
}
