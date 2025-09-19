
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { brandSchema } from "./schema";

// This is a mock database.
const MOCK_BRANDS = [
    {
        id: "brand_1",
        brandName: "Bajaj",
        countryOfOrigin: "India",
        establishedYear: 1945,
        headquarterLocation: "Pune, India",
        status: "Active",
        createdAt: new Date("2023-01-10"),
        updatedAt: new Date("2023-01-10"),
    },
    {
        id: "brand_2",
        brandName: "Honda",
        countryOfOrigin: "Japan",
        establishedYear: 1948,
        headquarterLocation: "Tokyo, Japan",
        status: "Active",
        createdAt: new Date("2023-02-15"),
        updatedAt: new Date("2023-02-15"),
    },
    {
        id: "brand_3",
        brandName: "Yamaha",
        countryOfOrigin: "Japan",
        establishedYear: 1955,
        headquarterLocation: "Iwata, Shizuoka, Japan",
        status: "Active",
        createdAt: new Date("2023-03-20"),
        updatedAt: new Date("2023-03-20"),
    },
    {
        id: "brand_4",
        brandName: "LML",
        countryOfOrigin: "India",
        establishedYear: 1972,
        headquarterLocation: "Kanpur, India",
        status: "Inactive",
        createdAt: new Date("2022-04-01"),
        updatedAt: new Date("2022-04-01"),
    }
];

let brands = [...MOCK_BRANDS];

export async function getBrands() {
  return Promise.resolve(brands);
}

export async function addBrand(
  data: z.infer<typeof brandSchema>
) {
  const newBrand = {
    id: `brand_${Date.now()}`,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  brands.push(newBrand);
  revalidatePath("/dashboard/master/vehicle/brand");
  return { success: true, message: "Brand added successfully." };
}

export async function editBrand(
  id: string,
  data: z.infer<typeof brandSchema>
) {
  const index = brands.findIndex((b) => b.id === id);
  if (index === -1) {
    return { success: false, message: "Brand not found." };
  }
  brands[index] = { ...brands[index], ...data, updatedAt: new Date() };
  revalidatePath("/dashboard/master/vehicle/brand");
  return { success: true, message: "Brand updated successfully." };
}

export async function deleteBrand(id: string) {
  brands = brands.filter((b) => b.id !== id);
  revalidatePath("/dashboard/master/vehicle/brand");
  return { success: true, message: "Brand deleted successfully." };
}
