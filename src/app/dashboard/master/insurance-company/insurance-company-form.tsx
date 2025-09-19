
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { insuranceCompanySchema } from "./schema";
import { InsuranceCompany } from "./columns";
import { CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const services = ["Health", "Motor", "Life", "Travel", "Property"] as const;

export function InsuranceCompanyFormContent({
  company,
  onSubmit,
  isSubmitting,
  onCancel,
  submitButtonText = "Save Changes",
  stateNames = [],
}: {
  company?: InsuranceCompany;
  onSubmit: (values: z.infer<typeof insuranceCompanySchema>) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  submitButtonText?: string;
  stateNames: string[];
}) {
  const form = useForm<z.infer<typeof insuranceCompanySchema>>({
    resolver: zodResolver(insuranceCompanySchema),
    defaultValues: company || {
      companyName: "",
      companyCode: "",
      registrationNumber: "",
      licenseNumber: "",
      contactPerson: "",
      contactNumber: "",
      email: "",
      website: "",
      headOfficeAddress: "",
      city: "",
      state: "",
      pinCode: "",
      branchesCount: 0,
      servicesOffered: [],
      status: "Active",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField control={form.control} name="companyName" render={({ field }) => (
                    <FormItem className="lg:col-span-2"><FormLabel>Company Name</FormLabel><FormControl><Input placeholder="e.g., HDFC ERGO" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="companyCode" render={({ field }) => (
                    <FormItem><FormLabel>Company Code</FormLabel><FormControl><Input placeholder="e.g., HDFC01" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="registrationNumber" render={({ field }) => (
                    <FormItem><FormLabel>Registration Number</FormLabel><FormControl><Input placeholder="Optional" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="licenseNumber" render={({ field }) => (
                    <FormItem><FormLabel>License Number</FormLabel><FormControl><Input placeholder="Optional" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="contactPerson" render={({ field }) => (
                    <FormItem><FormLabel>Contact Person</FormLabel><FormControl><Input placeholder="e.g., Mr. Rajesh Kumar" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="contactNumber" render={({ field }) => (
                    <FormItem><FormLabel>Contact Number</FormLabel><FormControl><Input placeholder="9876543210" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="support@company.com" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="website" render={({ field }) => (
                    <FormItem><FormLabel>Website</FormLabel><FormControl><Input placeholder="https://company.com" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="headOfficeAddress" render={({ field }) => (
                    <FormItem className="md:col-span-2 lg:col-span-3"><FormLabel>Head Office Address</FormLabel><FormControl><Textarea placeholder="Full postal address..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="e.g., Mumbai" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem><FormLabel>State</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger className="h-8"><SelectValue placeholder="Select a state" /></SelectTrigger></FormControl>
                            <SelectContent>{stateNames.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="pinCode" render={({ field }) => (
                    <FormItem><FormLabel>PIN Code</FormLabel><FormControl><Input placeholder="e.g., 400001" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="branchesCount" render={({ field }) => (
                    <FormItem><FormLabel>Branches Count</FormLabel><FormControl><Input type="number" placeholder="e.g., 25" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="servicesOffered" render={({ field }) => (
                    <FormItem className="md:col-span-2 lg:col-span-3">
                        <FormLabel>Services Offered</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 rounded-lg border p-4">
                            {services.map((item) => (
                                <FormField
                                key={item}
                                control={form.control}
                                name="servicesOffered"
                                render={({ field }) => (
                                    <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(item)}
                                                onCheckedChange={(checked) => {
                                                    return checked
                                                    ? field.onChange([...field.value, item])
                                                    : field.onChange(
                                                        field.value?.filter((value) => value !== item)
                                                      );
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">{item}</FormLabel>
                                    </FormItem>
                                )}
                                />
                            ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                )} />
                
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
