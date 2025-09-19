
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

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
import { financeCompanySchema } from "./schema";
import { FinanceCompany } from "./columns";
import { CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const licenseTypes = ["NBFC", "Microfinance", "Cooperative", "Other"];

export function FinanceCompanyFormContent({
  company,
  onSubmit,
  isSubmitting,
  onCancel,
  submitButtonText = "Save Changes",
  stateNames = [],
}: {
  company?: FinanceCompany;
  onSubmit: (values: z.infer<typeof financeCompanySchema>) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  submitButtonText?: string;
  stateNames: string[];
}) {
  const form = useForm<z.infer<typeof financeCompanySchema>>({
    resolver: zodResolver(financeCompanySchema),
    defaultValues: company || {
      companyName: "",
      licenseType: "NBFC",
      status: "Active",
      country: "India",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-8 p-2">
              {/* Basic Information */}
              <div className="border p-4 rounded-md space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField control={form.control} name="companyName" render={({ field }) => (
                          <FormItem className="lg:col-span-3"><FormLabel>Company Name</FormLabel><FormControl><Input placeholder="e.g., Bajaj Finance Limited" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="registrationNumber" render={({ field }) => (
                          <FormItem><FormLabel>Registration / CIN</FormLabel><FormControl><Input placeholder="Optional" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="licenseType" render={({ field }) => (
                          <FormItem><FormLabel>License Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="h-8"><SelectValue /></SelectTrigger></FormControl><SelectContent>{licenseTypes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                      )} />
                       <FormField control={form.control} name="incorporationDate" render={({ field }) => (
                          <FormItem className="flex flex-col pt-2"><FormLabel>Incorporation Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                              <Button variant={"outline"} className={cn("h-8 pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "dd/MM/yyyy") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                          </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="panNumber" render={({ field }) => (
                          <FormItem><FormLabel>PAN Number</FormLabel><FormControl><Input placeholder="Optional" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="gstNumber" render={({ field }) => (
                          <FormItem><FormLabel>GST Number</FormLabel><FormControl><Input placeholder="Optional" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                      )} />
                  </div>
              </div>

               {/* Contact Information */}
              <div className="border p-4 rounded-md space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField control={form.control} name="contactPersonName" render={({ field }) => (
                          <FormItem><FormLabel>Contact Person</FormLabel><FormControl><Input placeholder="e.g., Mr. Rajesh Kumar" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="contactPersonDesignation" render={({ field }) => (
                          <FormItem><FormLabel>Designation</FormLabel><FormControl><Input placeholder="e.g., Manager" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="mobileNumber" render={({ field }) => (
                          <FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input placeholder="9876543210" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                      )} />
                       <FormField control={form.control} name="alternatePhoneNumber" render={({ field }) => (
                          <FormItem><FormLabel>Alternate Number</FormLabel><FormControl><Input placeholder="Optional" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                          <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="contact@company.com" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                      )} />
                       <FormField control={form.control} name="website" render={({ field }) => (
                          <FormItem><FormLabel>Website</FormLabel><FormControl><Input placeholder="https://company.com" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                      )} />
                  </div>
              </div>
              
              {/* Address Details */}
              <div className="border p-4 rounded-md space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Address Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <FormField control={form.control} name="headOfficeAddress" render={({ field }) => (
                          <FormItem className="lg:col-span-4"><FormLabel>Head Office Address</FormLabel><FormControl><Textarea placeholder="Full postal address..." {...field} /></FormControl><FormMessage /></FormItem>
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
                      <FormField control={form.control} name="country" render={({ field }) => (
                          <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                      )} />
                  </div>
              </div>

               {/* Other Details */}
              <div className="border p-4 rounded-md space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Other Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FormField control={form.control} name="branchCount" render={({ field }) => (
                          <FormItem><FormLabel>Branch Count</FormLabel><FormControl><Input type="number" placeholder="e.g., 25" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                      )} />
                       <FormField control={form.control} name="notes" render={({ field }) => (
                          <FormItem className="lg:col-span-2"><FormLabel>Notes / Remarks</FormLabel><FormControl><Textarea placeholder="Add any relevant notes..." {...field} /></FormControl><FormMessage /></FormItem>
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
