
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
import { colorSchema } from "./schema";
import { Color } from "./columns";
import { CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const finishTypes = ["Solid", "Metallic", "Matte", "Pearl", "Dual-Tone"];

export function ColorFormContent({
  color,
  onSubmit,
  isSubmitting,
  onCancel,
  submitButtonText = "Save Changes",
}: {
  color?: Color;
  onSubmit: (values: z.infer<typeof colorSchema>) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  submitButtonText?: string;
}) {
  const form = useForm<z.infer<typeof colorSchema>>({
    resolver: zodResolver(colorSchema),
    defaultValues: color || {
      colorName: "",
      colorCode: "",
      finishType: "Solid",
      status: "Active",
    },
  });
  
  const handleReset = () => {
    form.reset({
      colorName: "",
      colorCode: "",
      finishType: "Solid",
      status: "Active",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="colorName" render={({ field }) => (
                    <FormItem><FormLabel>Color Name</FormLabel><FormControl><Input placeholder="e.g., Pearl White" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="colorCode" render={({ field }) => (
                    <FormItem><FormLabel>Color Code (Hex/RGB)</FormLabel><FormControl><Input placeholder="e.g., #FFFFFF" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="finishType" render={({ field }) => (
                    <FormItem><FormLabel>Finish Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>{finishTypes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
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
