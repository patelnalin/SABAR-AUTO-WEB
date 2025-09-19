
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { financeCompanySchema } from "./schema";

// This is a mock database.
const MOCK_DATA = [
  {
    id: "fc_1",
    companyName: "Bajaj Finance Limited",
    registrationNumber: "L65921PN1987PLC042961",
    licenseType: "NBFC",
    panNumber: "AABCD1234E",
    gstNumber: "27AABCU9603R1Z5",
    incorporationDate: new Date("1987-10-25"),
    contactPersonName: "Sanjiv Bajaj",
    contactPersonDesignation: "Chairman & MD",
    mobileNumber: "9876543210",
    alternatePhoneNumber: "",
    email: "investor.service@bajajfinserv.in",
    website: "https://www.bajajfinserv.in",
    headOfficeAddress: "Akurdi, Pune",
    city: "Pune",
    state: "Maharashtra",
    pinCode: "411035",
    country: "India",
    branchCount: 1200,
    status: "Active",
    notes: "Leading NBFC in India.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "fc_2",
    companyName: "Muthoot Finance Ltd",
    registrationNumber: "L65910KL1997PLC011300",
    licenseType: "NBFC",
    panNumber: "AAECM1234F",
    gstNumber: "32AAECM1234F1Z5",
    incorporationDate: new Date("1997-03-14"),
    contactPersonName: "George Alexander Muthoot",
    contactPersonDesignation: "Managing Director",
    mobileNumber: "9123456789",
    alternatePhoneNumber: "",
    email: "info@muthootfinance.com",
    website: "https://www.muthootfinance.com",
    headOfficeAddress: "Muthoot Chambers, Kurian Towers, Banerji Road",
    city: "Kochi",
    state: "Kerala",
    pinCode: "682018",
    country: "India",
    branchCount: 4500,
    status: "Active",
    notes: "Specializes in gold loans.",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

let companies = [...MOCK_DATA];

export async function getFinanceCompanies() {
  return Promise.resolve(companies);
}

export async function addFinanceCompany(
  data: z.infer<typeof financeCompanySchema>
) {
  const newItem = {
    id: `fc_${Date.now()}`,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  companies.push(newItem);
  revalidatePath("/dashboard/master/finance");
  return { success: true, message: "Finance company added successfully." };
}

export async function editFinanceCompany(
  id: string,
  data: z.infer<typeof financeCompanySchema>
) {
  const index = companies.findIndex((item) => item.id === id);
  if (index === -1) {
    return { success: false, message: "Record not found." };
  }
  companies[index] = { ...companies[index], ...data, updatedAt: new Date() };
  revalidatePath("/dashboard/master/finance");
  return { success: true, message: "Record updated successfully." };
}

export async function deleteFinanceCompany(id: string) {
  companies = companies.filter((item) => item.id !== id);
  revalidatePath("/dashboard/master/finance");
  return { success: true, message: "Record deleted successfully." };
}

export async function getStates() {
    // In a real app, this would come from a database.
    return Promise.resolve([
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
        "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
        "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", 
        "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ]);
}
