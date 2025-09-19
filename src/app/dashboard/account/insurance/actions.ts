
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { insuranceSchema } from "./schema";

const MOCK_POLICIES = [
  {
    id: 'pol_1',
    policyNumber: 'V-2024-101',
    policyType: 'Vehicle',
    insuranceCompany: 'Bajaj Allianz',
    policyHolderName: 'Sabar Bajaj Showroom',
    phoneNumber: '9876543210',
    email: 'contact@sabar.com',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2025-01-01'),
    premiumAmount: 50000,
    sumInsured: 10000000,
    paymentMode: 'Bank Transfer',
    renewalStatus: 'Active',
    agentName: 'Self',
    status: 'Active',
    notes: 'Blanket policy for showroom vehicles.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'pol_2',
    policyNumber: 'H-2024-202',
    policyType: 'Health',
    insuranceCompany: 'Star Health',
    policyHolderName: 'Suresh Patil',
    phoneNumber: '9876543211',
    email: 'suresh.p@example.com',
    startDate: new Date('2024-05-15'),
    endDate: new Date('2025-05-14'),
    premiumAmount: 15000,
    sumInsured: 500000,
    paymentMode: 'UPI',
    renewalStatus: 'Active',
    agentName: 'HealthSecur Inc.',
    status: 'Active',
    notes: 'Family floater plan.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'pol_3',
    policyNumber: 'F-2023-303',
    policyType: 'Fire',
    insuranceCompany: 'New India Assurance',
    policyHolderName: 'Sabar Bajaj Warehouse',
    phoneNumber: '9876543210',
    email: 'warehouse@sabar.com',
    startDate: new Date('2023-10-01'),
    endDate: new Date('2024-09-30'),
    premiumAmount: 75000,
    sumInsured: 50000000,
    paymentMode: 'Cheque',
    renewalStatus: 'Renewal Due',
    agentName: 'SecureRisk Brokers',
    status: 'Active',
    notes: 'Policy for main warehouse building and stock.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'pol_4',
    policyNumber: 'V-2023-102',
    policyType: 'Vehicle',
    insuranceCompany: 'ICICI Lombard',
    policyHolderName: 'Rajesh Kumar',
    phoneNumber: '9123456789',
    email: 'rajesh.k@example.com',
    startDate: new Date('2023-08-20'),
    endDate: new Date('2024-08-19'),
    premiumAmount: 12000,
    sumInsured: 800000,
    paymentMode: 'Credit Card',
    renewalStatus: 'Expired',
    agentName: 'Self',
    status: 'Inactive',
    notes: 'For personal vehicle.',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

let policies = [...MOCK_POLICIES];

export async function getInsurancePolicies() {
  return Promise.resolve(policies);
}

export async function addInsurancePolicy(
  data: z.infer<typeof insuranceSchema>
) {
  const newPolicy = {
    id: `pol_${Date.now()}`,
    renewalStatus: 'Active',
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  policies.push(newPolicy);
  revalidatePath("/dashboard/account/insurance");
  return { success: true, message: "Insurance policy added successfully." };
}

export async function editInsurancePolicy(
  id: string,
  data: z.infer<typeof insuranceSchema>
) {
  const index = policies.findIndex((p) => p.id === id);
  if (index === -1) {
    return { success: false, message: "Policy not found." };
  }
  policies[index] = { ...policies[index], ...data, updatedAt: new Date() };
  revalidatePath("/dashboard/account/insurance");
  return { success: true, message: "Policy updated successfully." };
}

export async function deleteInsurancePolicy(id: string) {
  policies = policies.filter((p) => p.id !== id);
  revalidatePath("/dashboard/account/insurance");
  return { success: true, message: "Policy deleted successfully." };
}

// This is a mock database.
export const db = {
  getPolicies: async () => policies,
  addPolicy: async (data: z.infer<typeof insuranceSchema>) => {
    const newPolicy = {
      id: `pol_${Date.now()}`,
      renewalStatus: 'Active' as const,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    policies.push(newPolicy);
    return newPolicy;
  },
  editPolicy: async (id: string, data: z.infer<typeof insuranceSchema>) => {
    const index = policies.findIndex((p) => p.id === id);
    if (index === -1) {
      return null;
    }
    policies[index] = { ...policies[index], ...data, updatedAt: new Date() };
    return policies[index];
  },
  deletePolicy: async (id: string) => {
    const initialLength = policies.length;
    policies = policies.filter((p) => p.id !== id);
    return policies.length < initialLength;
  },
};
