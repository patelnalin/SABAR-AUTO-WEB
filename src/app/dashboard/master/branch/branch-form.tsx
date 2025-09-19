
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { branchSchema } from "./schema";
import { Branch } from "./columns";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export function BranchFormContent({
  branch,
  onSubmit,
  isSubmitting,
  onCancel,
  submitButtonText = "Save Changes",
}: {
  branch?: Branch;
  onSubmit: (values: z.infer<typeof branchSchema>) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  submitButtonText?: string;
}) {
  const form = useForm<z.infer<typeof branchSchema>>({
    resolver: zodResolver(branchSchema),
    defaultValues: branch || {
      branchCode: "",
      branchName: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      email: "",
      managerName: "",
      openingHours: "",
      gstin: "",
      bankAccount: "",
      activeStatus: true,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent>
          <div className="space-y-8">
            <div className="border p-4 rounded-md space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Branch Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="branchCode" render={({ field }) => (
                    <FormItem><FormLabel>Branch Code</FormLabel><FormControl><Input placeholder="PUN-KOTH" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="branchName" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Branch Name</FormLabel><FormControl><Input placeholder="Pune Kothrud Branch" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </div>

            <div className="border p-4 rounded-md space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Address & Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem className="lg:col-span-4"><FormLabel>Street Address</FormLabel><FormControl><Textarea placeholder="123 Main Street" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Pune" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="Maharashtra" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="pincode" render={({ field }) => (
                    <FormItem><FormLabel>Pincode</FormLabel><FormControl><Input placeholder="411038" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="9876543210" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                 )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem className="lg:col-span-3"><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="branch@example.com" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                 )} />
              </div>
            </div>

            <div className="border p-4 rounded-md space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Operational Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 <FormField control={form.control} name="managerName" render={({ field }) => (
                    <FormItem><FormLabel>Manager Name</FormLabel><FormControl><Input placeholder="Suresh Patil" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="openingHours" render={({ field }) => (
                    <FormItem><FormLabel>Opening Hours</FormLabel><FormControl><Input placeholder="9 AM - 8 PM" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="gstin" render={({ field }) => (
                    <FormItem><FormLabel>GSTIN</FormLabel><FormControl><Input placeholder="27AAACB2442F1Z5" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="bankAccount" render={({ field }) => (
                    <FormItem className="lg:col-span-2"><FormLabel>Bank Account Number</FormLabel><FormControl><Input placeholder="Enter account number" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                 )} />
                <FormField control={form.control} name="activeStatus" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm lg:col-span-3">
                        <div className="space-y-0.5">
                            <FormLabel>Active Status</FormLabel>
                            <FormDescription>
                                Deactivate this branch to hide it from active lists.
                            </FormDescription>
                        </div>
                         <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                         </FormControl>
                    </FormItem>
                 )} />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitButtonText}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
