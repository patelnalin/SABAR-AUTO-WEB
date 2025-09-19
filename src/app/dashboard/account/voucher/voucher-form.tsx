
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
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
import { voucherSchema } from "./schema";
import { Voucher } from "./columns";
import { CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const voucherTypes = ["Payment", "Receipt", "Contra", "Journal"];
const paymentModes = ["Cash", "Bank Transfer", "UPI", "Cheque"];
const statuses = ["Draft", "Posted", "Cancelled"];

export function VoucherFormContent({
  voucher,
  onSubmit,
  isSubmitting,
  onCancel,
  submitButtonText = "Save Changes",
}: {
  voucher?: Voucher;
  onSubmit: (values: z.infer<typeof voucherSchema>) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  submitButtonText?: string;
}) {
  const form = useForm<z.infer<typeof voucherSchema>>({
    resolver: zodResolver(voucherSchema),
    defaultValues: voucher || {
        voucherNumber: "",
        voucherDate: new Date(),
        voucherType: "Payment",
        accountName: "",
        amount: 0,
        paymentMode: "UPI",
        referenceNo: "",
        narration: "",
        status: "Draft",
    },
  });

  const selectedVoucherType = form.watch("voucherType");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField control={form.control} name="voucherNumber" render={({ field }) => (
                    <FormItem><FormLabel>Voucher No.</FormLabel><FormControl><Input placeholder="e.g., PAY-001" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="voucherDate" render={({ field }) => (
                    <FormItem className="flex flex-col pt-2"><FormLabel>Voucher Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "dd/MM/yyyy") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                    </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="voucherType" render={({ field }) => (
                    <FormItem><FormLabel>Voucher Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>{voucherTypes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="accountName" render={({ field }) => (
                    <FormItem className="md:col-span-2 lg:col-span-3"><FormLabel>Account Name / Ledger</FormLabel><FormControl><Input placeholder="e.g., Office Supplies, Sales Account" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="amount" render={({ field }) => (
                    <FormItem><FormLabel>Amount (₹)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />

               {(selectedVoucherType === 'Payment' || selectedVoucherType === 'Receipt' || selectedVoucherType === 'Contra') && (
                    <>
                         <FormField control={form.control} name="paymentMode" render={({ field }) => (
                            <FormItem><FormLabel>Payment Mode</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>{paymentModes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                            </Select><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="referenceNo" render={({ field }) => (
                            <FormItem><FormLabel>Reference No.</FormLabel><FormControl><Input placeholder="Cheque No., UTR, etc." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </>
                )}
                
                 <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>{statuses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="narration" render={({ field }) => (
                    <FormItem className="md:col-span-2 lg:col-span-3"><FormLabel>Narration / Notes</FormLabel><FormControl><Textarea placeholder="Add a short description for this voucher entry..." {...field} /></FormControl><FormMessage /></FormItem>
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
