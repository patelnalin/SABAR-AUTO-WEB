
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { modelSchema } from "./schema";
import { getBrands } from "../brand/actions";

// This is a mock database.
const MOCK_MODELS = [
    {
        id: "model_1",
        modelCode: "BJ-PNS200",
        modelName: "Pulsar NS200",
        brandName: "Bajaj",
        fuelType: "Petrol",
        seatingCapacity: 2,
        engineCapacity: 199,
        transmissionType: "Manual",
        priceRange: "1.4L - 1.5L",
        launchYear: 2012,
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "model_2",
        modelCode: "BJ-D400",
        modelName: "Dominar 400",
        brandName: "Bajaj",
        fuelType: "Petrol",
        seatingCapacity: 2,
        engineCapacity: 373,
        transmissionType: "Manual",
        priceRange: "2.3L - 2.5L",
        launchYear: 2016,
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "model_3",
        modelCode: "BJ-CETAK",
        modelName: "Chetak",
        brandName: "Bajaj",
        fuelType: "Electric",
        seatingCapacity: 2,
        engineCapacity: undefined,
        transmissionType: "Automatic",
        priceRange: "1.2L - 1.4L",
        launchYear: 2020,
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "model_4",
        modelCode: "HN-H2.0",
        modelName: "Hornet 2.0",
        brandName: "Honda",
        fuelType: "Petrol",
        seatingCapacity: 2,
        engineCapacity: 184,
        transmissionType: "Manual",
        priceRange: "1.3L - 1.4L",
        launchYear: 2020,
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "model_5",
        modelCode: "HN-A6G",
        modelName: "Activa 6G",
        brandName: "Honda",
        fuelType: "Petrol",
        seatingCapacity: 2,
        engineCapacity: 109,
        transmissionType: "CVT",
        priceRange: "75k - 85k",
        launchYear: 2020,
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "model_6",
        modelCode: "YM-R15V4",
        modelName: "R15 V4",
        brandName: "Yamaha",
        fuelType: "Petrol",
        seatingCapacity: 2,
        engineCapacity: 155,
        transmissionType: "Manual",
        priceRange: "1.8L - 1.9L",
        launchYear: 2021,
        status: "Inactive",
        createdAt: new Date(),
        updatedAt: new Date(),
    }
];

let models = [...MOCK_MODELS];

export async function getVehicleBrandNames() {
    const brands = await getBrands();
    return brands.map(brand => brand.brandName);
}

export async function getModels() {
  return Promise.resolve(models);
}

export async function addModel(
  data: z.infer<typeof modelSchema>
) {
  const newModel = {
    id: `model_${Date.now()}`,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  models.push(newModel);
  revalidatePath("/dashboard/master/vehicle/model");
  return { success: true, message: "Model added successfully." };
}

export async function editModel(
  id: string,
  data: z.infer<typeof modelSchema>
) {
  const index = models.findIndex((m) => m.id === id);
  if (index === -1) {
    return { success: false, message: "Model not found." };
  }
  models[index] = { ...models[index], ...data, updatedAt: new Date() };
  revalidatePath("/dashboard/master/vehicle/model");
  return { success: true, message: "Model updated successfully." };
}

export async function deleteModel(id: string) {
  models = models.filter((m) => m.id !== id);
  revalidatePath("/dashboard/master/vehicle/model");
  return { success: true, message: "Model deleted successfully." };
}
