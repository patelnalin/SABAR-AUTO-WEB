
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, XCircle, PlusCircle } from "lucide-react";

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
import { brandSchema } from "./schema";
import { Brand } from "./columns";
import { CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const countries = ["India", "Japan", "Germany", "USA", "Italy", "UK"];

export function BrandFormContent({
  brand,
  onSubmit,
  isSubmitting,
  onCancel,
  submitButtonText = "Save Changes",
}: {
  brand?: Brand;
  onSubmit: (values: z.infer<typeof brandSchema>) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  submitButtonText?: string;
}) {
  const form = useForm<z.infer<typeof brandSchema>>({
    resolver: zodResolver(brandSchema),
    defaultValues: brand || {
      brandName: "",
      countryOfOrigin: "India",
      establishedYear: new Date().getFullYear(),
      headquarterLocation: "",
      status: "Active",
    },
  });
  
  const handleReset = () => {
    form.reset({
      brandName: "",
      countryOfOrigin: "India",
      establishedYear: new Date().getFullYear(),
      headquarterLocation: "",
      status: "Active",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="brandName" render={({ field }) => (
                    <FormItem><FormLabel>Brand Name</FormLabel><FormControl><Input placeholder="e.g., Bajaj" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="countryOfOrigin" render={({ field }) => (
                    <FormItem><FormLabel>Country of Origin</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>{countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="establishedYear" render={({ field }) => (
                    <FormItem><FormLabel>Established Year</FormLabel><FormControl><Input type="number" placeholder="e.g., 1945" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="headquarterLocation" render={({ field }) => (
                    <FormItem><FormLabel>Headquarter Location</FormLabel><FormControl><Input placeholder="e.g., Pune, India" {...field} /></FormControl><FormMessage /></FormItem>
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
