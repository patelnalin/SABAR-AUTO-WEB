
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { modelSchema } from "./schema";
import { Model } from "./columns";
import { CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
const transmissionTypes = ["Manual", "Automatic", "AMT", "CVT", "DCT"];

export function ModelFormContent({
  model,
  onSubmit,
  isSubmitting,
  onCancel,
  submitButtonText = "Save Changes",
  brandNames = [],
}: {
  model?: Model;
  onSubmit: (values: z.infer<typeof modelSchema>) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  submitButtonText?: string;
  brandNames: string[];
}) {
  const form = useForm<z.infer<typeof modelSchema>>({
    resolver: zodResolver(modelSchema),
    defaultValues: model || {
      modelCode: "",
      modelName: "",
      brandName: brandNames[0] || "",
      fuelType: "Petrol",
      seatingCapacity: 2,
      engineCapacity: 150,
      transmissionType: "Manual",
      priceRange: "",
      launchYear: new Date().getFullYear(),
      status: "Active",
    },
  });
  
  const handleReset = () => {
    form.reset({
      modelCode: "",
      modelName: "",
      brandName: brandNames[0] || "",
      fuelType: "Petrol",
      seatingCapacity: 2,
      engineCapacity: 150,
      transmissionType: "Manual",
      priceRange: "",
      launchYear: new Date().getFullYear(),
      status: "Active",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField control={form.control} name="brandName" render={({ field }) => (
                    <FormItem><FormLabel>Brand Name</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>{brandNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="modelCode" render={({ field }) => (
                    <FormItem><FormLabel>Model Code</FormLabel><FormControl><Input placeholder="e.g., BJ-PNS200" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="modelName" render={({ field }) => (
                    <FormItem><FormLabel>Model Name</FormLabel><FormControl><Input placeholder="e.g., Pulsar NS200" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="fuelType" render={({ field }) => (
                    <FormItem><FormLabel>Fuel Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>{fuelTypes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="transmissionType" render={({ field }) => (
                    <FormItem><FormLabel>Transmission Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>{transmissionTypes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="engineCapacity" render={({ field }) => (
                    <FormItem><FormLabel>Engine Capacity (CC)</FormLabel><FormControl><Input type="number" placeholder="e.g., 199" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="seatingCapacity" render={({ field }) => (
                    <FormItem><FormLabel>Seating Capacity</FormLabel><FormControl><Input type="number" placeholder="e.g., 2" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="launchYear" render={({ field }) => (
                    <FormItem><FormLabel>Launch Year</FormLabel><FormControl><Input type="number" placeholder="e.g., 2023" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="priceRange" render={({ field }) => (
                    <FormItem><FormLabel>Price Range</FormLabel><FormControl><Input placeholder="e.g., 1.4L - 1.5L" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>

            <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem className="space-y-3"><FormLabel>Status</FormLabel>
                    <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center gap-6">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Active" id="status-active" /></FormControl><FormLabel htmlFor="status-active" className="font-normal">Active</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Inactive" id="status-inactive" /></FormControl><FormLabel htmlFor="status-inactive" className="font-normal">Inactive</FormLabel></FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />
          </div>
        <CardFooter className="flex justify-end gap-2 pt-8">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="button" variant="ghost" onClick={handleReset}>Reset</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitButtonText}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
