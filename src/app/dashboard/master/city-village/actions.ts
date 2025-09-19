
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { cityVillageSchema } from "./schema";

// This is a mock database.
const MOCK_DATA = [
  {
    id: "addr_1",
    village: "Ramnagar",
    post: "Post-Ramnagar",
    city: "Surat",
    state: "Gujarat",
    pincode: "395007",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "addr_2",
    village: "Bhiloda",
    post: "Post-Bhiloda",
    city: "Himmatnagar",
    state: "Gujarat",
    pincode: "383245",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "addr_3",
    village: "Hinjawadi",
    post: "Post-Hinjawadi",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411057",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "addr_4",
    village: "Wagholi",
    post: "Post-Wagholi",
    city: "Pune",
    state: "Maharashtra",
    pincode: "412207",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

let addresses = [...MOCK_DATA];

export async function getAddresses() {
  return Promise.resolve(addresses);
}

export async function addAddress(
  data: z.infer<typeof cityVillageSchema>
) {
  const newItem = {
    id: `${data.village.toLowerCase().slice(0,3)}_${Date.now()}`,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  addresses.push(newItem);
  revalidatePath("/dashboard/master/city-village");
  return { success: true, message: "Address added successfully." };
}

export async function editAddress(
  id: string,
  data: z.infer<typeof cityVillageSchema>
) {
  const index = addresses.findIndex((item) => item.id === id);
  if (index === -1) {
    return { success: false, message: "Record not found." };
  }
  addresses[index] = { ...addresses[index], ...data, updatedAt: new Date() };
  revalidatePath("/dashboard/master/city-village");
  return { success: true, message: "Record updated successfully." };
}

export async function deleteAddress(id: string) {
  addresses = addresses.filter((item) => item.id !== id);
  revalidatePath("/dashboard/master/city-village");
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
