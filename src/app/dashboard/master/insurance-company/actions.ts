
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { insuranceCompanySchema } from "./schema";

// This is a mock database.
const MOCK_DATA = [
  {
    id: "ic_1",
    companyName: "HDFC ERGO General Insurance",
    companyCode: "HDFC01",
    registrationNumber: "IRDAI Reg. No. 146",
    licenseNumber: "LIC-12345",
    contactPerson: "Rajesh Kumar",
    contactNumber: "9876543210",
    email: "support@hdfcergo.com",
    website: "https://www.hdfcergo.com",
    headOfficeAddress: "1st Floor, HDFC House, Backbay Reclamation, H. T. Parekh Marg, Churchgate",
    city: "Mumbai",
    state: "Maharashtra",
    pinCode: "400020",
    branchesCount: 200,
    servicesOffered: ["Health", "Motor", "Travel", "Property"],
    status: "Active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "ic_2",
    companyName: "Bajaj Allianz General Insurance",
    companyCode: "BAJAJ01",
    registrationNumber: "IRDAI Reg. No. 113",
    licenseNumber: "LIC-54321",
    contactPerson: "Sunita Sharma",
    contactNumber: "9123456789",
    email: "customercare@bajajallianz.co.in",
    website: "https://www.bajajallianz.com",
    headOfficeAddress: "GE Plaza, Airport Road, Yerawada",
    city: "Pune",
    state: "Maharashtra",
    pinCode: "411006",
    branchesCount: 250,
    servicesOffered: ["Health", "Motor", "Life"],
    status: "Active",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

let companies = [...MOCK_DATA];

export async function getInsuranceCompanies() {
  return Promise.resolve(companies);
}

export async function addInsuranceCompany(
  data: z.infer<typeof insuranceCompanySchema>
) {
  if (companies.some(c => c.companyCode === data.companyCode)) {
      return { success: false, message: "Company code must be unique." };
  }
  const newItem = {
    id: `ic_${Date.now()}`,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  companies.push(newItem);
  revalidatePath("/dashboard/master/insurance-company");
  return { success: true, message: "Insurance company added successfully." };
}

export async function editInsuranceCompany(
  id: string,
  data: z.infer<typeof insuranceCompanySchema>
) {
  const index = companies.findIndex((item) => item.id === id);
  if (index === -1) {
    return { success: false, message: "Record not found." };
  }
  companies[index] = { ...companies[index], ...data, updatedAt: new Date() };
  revalidatePath("/dashboard/master/insurance-company");
  return { success: true, message: "Record updated successfully." };
}

export async function deleteInsuranceCompany(id: string) {
  companies = companies.filter((item) => item.id !== id);
  revalidatePath("/dashboard/master/insurance-company");
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
