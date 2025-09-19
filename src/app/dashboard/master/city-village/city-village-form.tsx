
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
import { cityVillageSchema } from "./schema";
import { Address } from "./columns";
import { CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export function CityVillageFormContent({
  item,
  onSubmit,
  isSubmitting,
  onCancel,
  submitButtonText = "Save Changes",
  stateNames = []
}: {
  item?: Address;
  onSubmit: (values: z.infer<typeof cityVillageSchema>) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  submitButtonText?: string;
  stateNames: string[];
}) {
  const form = useForm<z.infer<typeof cityVillageSchema>>({
    resolver: zodResolver(cityVillageSchema),
    defaultValues: item || {
      village: "",
      post: "",
      city: "",
      state: "",
      pincode: "",
    },
  });
  
  const handleReset = () => {
    form.reset({
      village: "",
      post: "",
      city: "",
      state: "",
      pincode: "",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="village" render={({ field }) => (
                    <FormItem><FormLabel>Village</FormLabel><FormControl><Input placeholder="e.g., Ramnagar" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="post" render={({ field }) => (
                    <FormItem><FormLabel>Post</FormLabel><FormControl><Input placeholder="e.g., Post-Ramnagar" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="e.g., Surat" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
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
                <FormField control={form.control} name="pincode" render={({ field }) => (
                    <FormItem><FormLabel>PIN Code</FormLabel><FormControl><Input placeholder="e.g., 395007" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
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
