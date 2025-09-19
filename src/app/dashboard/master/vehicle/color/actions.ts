
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { colorSchema } from "./schema";

// This is a mock database.
const MOCK_COLORS = [
    {
        id: "color_1",
        colorName: "Pearl White",
        colorCode: "#F8F8FF",
        finishType: "Pearl",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "color_2",
        colorName: "Racing Red",
        colorCode: "#FF0000",
        finishType: "Solid",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "color_3",
        colorName: "Stealth Black",
        colorCode: "#1C1C1C",
        finishType: "Matte",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "color_4",
        colorName: "Graphite Grey",
        colorCode: "#5C5C5C",
        finishType: "Metallic",
        status: "Inactive",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "color_5",
        colorName: "Blue/Silver",
        colorCode: "#0000FF/#C0C0C0",
        finishType: "Dual-Tone",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
    }
];

let colors = [...MOCK_COLORS];

export async function getColors() {
  return Promise.resolve(colors);
}

export async function addColor(
  data: z.infer<typeof colorSchema>
) {
  const newColor = {
    id: `color_${Date.now()}`,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  colors.push(newColor);
  revalidatePath("/dashboard/master/vehicle/color");
  return { success: true, message: "Color added successfully." };
}

export async function editColor(
  id: string,
  data: z.infer<typeof colorSchema>
) {
  const index = colors.findIndex((c) => c.id === id);
  if (index === -1) {
    return { success: false, message: "Color not found." };
  }
  colors[index] = { ...colors[index], ...data, updatedAt: new Date() };
  revalidatePath("/dashboard/master/vehicle/color");
  return { success: true, message: "Color updated successfully." };
}

export async function deleteColor(id: string) {
  colors = colors.filter((c) => c.id !== id);
  revalidatePath("/dashboard/master/vehicle/color");
  return { success: true, message: "Color deleted successfully." };
}
