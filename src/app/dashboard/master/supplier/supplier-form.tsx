
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
import { supplierSchema } from "./schema";
import { Supplier } from "./columns";
import { CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

export function SupplierFormContent({
  supplier,
  onSubmit,
  isSubmitting,
  onCancel,
  submitButtonText = "Save Changes",
}: {
  supplier?: Supplier;
  onSubmit: (values: z.infer<typeof supplierSchema>) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  submitButtonText?: string;
}) {
  const form = useForm<z.infer<typeof supplierSchema>>({
    resolver: zodResolver(supplierSchema),
    defaultValues: supplier || {
      supplierName: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      gstin: "",
      status: "Active",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField control={form.control} name="supplierName" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Supplier Name</FormLabel><FormControl><Input placeholder="e.g., Reliable Auto Parts" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="contactPerson" render={({ field }) => (
                    <FormItem><FormLabel>Contact Person (Optional)</FormLabel><FormControl><Input placeholder="e.g., Mr. Verma" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="9876543210" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="contact@supplier.com" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Address</FormLabel><FormControl><Textarea placeholder="123, Auto Market" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="e.g., Delhi" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="e.g., Delhi" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="pincode" render={({ field }) => (
                    <FormItem><FormLabel>Pincode</FormLabel><FormControl><Input placeholder="e.g., 110006" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="gstin" render={({ field }) => (
                    <FormItem><FormLabel>GSTIN (Optional)</FormLabel><FormControl><Input placeholder="27ABCDE1234F1Z5" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitButtonText}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
