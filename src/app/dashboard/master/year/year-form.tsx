
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";

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
import { financialYearSchema } from "./schema";
import { FinancialYear } from "./columns";
import { CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { editFinancialYear } from "./actions";

export function YearFormContent({
  year,
  onSubmit,
  isSubmitting,
  onCancel,
  submitButtonText = "Save Changes",
}: {
  year?: FinancialYear;
  onSubmit: (values: z.infer<typeof financialYearSchema>) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  submitButtonText?: string;
}) {
  const form = useForm<z.infer<typeof financialYearSchema>>({
    resolver: zodResolver(financialYearSchema),
    defaultValues: year || {
      yearName: "",
      startDate: undefined,
      endDate: undefined,
      status: "Inactive",
    },
  });
  
  const handleReset = () => {
    form.reset({
      yearName: "",
      startDate: undefined,
      endDate: undefined,
      status: "Inactive",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="yearName" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Financial Year Name</FormLabel><FormControl><Input placeholder="e.g., 2024-2025" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="startDate" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Start Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "dd/MM/yyyy") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                    </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="endDate" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>End Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "dd/MM/yyyy") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                    </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                )} />
            </div>

            <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem className="space-y-3"><FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>{["Active", "Inactive"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
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


// Dialog Wrapper for Edit
type YearFormDialogProps = {
  year: FinancialYear;
  trigger: React.ReactNode;
};

export function YearFormDialog({ year, trigger }: YearFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof financialYearSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await editFinancialYear(year.id, values);

      if (result.success) {
        toast({ title: "Success", description: result.message });
        setIsOpen(false);
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Financial Year</DialogTitle>
          <DialogDescription>
            Update the details for the financial year.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4">
            <YearFormContent 
                year={year}
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
                onCancel={() => setIsOpen(false)}
                submitButtonText="Save Changes"
            />
        </div>
      </DialogContent>
    </Dialog>
  );
}
