
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Calendar as CalendarIcon, Upload } from "lucide-react";
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
import { paymentSchema } from "./schema";
import { Payment } from "./columns";
import { CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const paymentTypes = ["Receipt", "Due Payment", "Advance", "RTO", "Insurance"];
const paymentMethods = ["Cash", "Bank Transfer", "Credit Card", "UPI", "Cheque"];
const statuses = ["Pending", "Completed", "Partial", "Failed"];

export function PaymentFormContent({
  payment,
  onSubmit,
  isSubmitting,
  onCancel,
  submitButtonText = "Save Changes",
}: {
  payment?: Payment;
  onSubmit: (values: z.infer<typeof paymentSchema>) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  submitButtonText?: string;
}) {
  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: payment || {
        paymentType: "Receipt",
        paymentDate: new Date(),
        customerName: "",
        vehicleModel: "",
        chassisNo: "",
        engineNo: "",
        amount: 0,
        paymentMode: "UPI",
        paymentStatus: "Completed",
        invoiceNumber: "",
        notes: "",
    },
  });

  const selectedPaymentType = form.watch("paymentType");
  const selectedPaymentMethod = form.watch("paymentMethod");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-8 p-2">
            
            {/* Payment Details */}
            <div className="border p-4 rounded-md space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField control={form.control} name="paymentType" render={({ field }) => (
                        <FormItem><FormLabel>Payment Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>{paymentTypes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="paymentDate" render={({ field }) => (
                        <FormItem className="flex flex-col pt-2"><FormLabel>Payment Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "dd/MM/yyyy") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                        </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="amount" render={({ field }) => (
                        <FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="paymentMode" render={({ field }) => (
                        <FormItem><FormLabel>Payment Method</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>{paymentMethods.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select><FormMessage /></FormItem>
                    )} />
                     { (selectedPaymentMethod === 'Bank Transfer' || selectedPaymentMethod === 'UPI') &&
                        <FormField control={form.control} name="transactionId" render={({ field }) => (
                            <FormItem><FormLabel>Transaction ID / UTR No</FormLabel><FormControl><Input placeholder="Enter Transaction ID" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    }
                    { selectedPaymentMethod === 'Cheque' &&
                        <FormField control={form.control} name="chequeNumber" render={({ field }) => (
                            <FormItem><FormLabel>Cheque Number</FormLabel><FormControl><Input placeholder="Enter Cheque Number" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    }
                     <FormField control={form.control} name="paymentStatus" render={({ field }) => (
                        <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>{statuses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select><FormMessage /></FormItem>
                    )} />
                </div>
            </div>

            {/* Customer and Vehicle Details */}
            <div className="border p-4 rounded-md space-y-4">
                 <h3 className="text-lg font-semibold border-b pb-2">Customer & Vehicle Details</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField control={form.control} name="customerName" render={({ field }) => (
                        <FormItem className="lg:col-span-3"><FormLabel>Customer Name</FormLabel><FormControl><Input placeholder="Search or enter customer name..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="vehicleModel" render={({ field }) => (
                        <FormItem><FormLabel>Vehicle Model</FormLabel><FormControl><Input placeholder="e.g., Pulsar NS200" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="chassisNo" render={({ field }) => (
                        <FormItem><FormLabel>Chassis No</FormLabel><FormControl><Input placeholder="Vehicle chassis number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="engineNo" render={({ field }) => (
                        <FormItem><FormLabel>Engine No</FormLabel><FormControl><Input placeholder="Vehicle engine number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                 </div>
            </div>

            {/* Conditional RTO / Insurance Details */}
            {(selectedPaymentType === 'RTO' || selectedPaymentType === 'Insurance') && (
                <div className="border p-4 rounded-md space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">{selectedPaymentType} Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FormField control={form.control} name="policyOrFileNo" render={({ field }) => (
                            <FormItem><FormLabel>{selectedPaymentType === 'Insurance' ? 'Policy No' : 'RTO File No'}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        {selectedPaymentType === 'Insurance' && 
                             <FormField control={form.control} name="expiryDate" render={({ field }) => (
                                <FormItem className="flex flex-col pt-2"><FormLabel>Validity / Expiry Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                                    <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "dd/MM/yyyy") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                                </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                            )} />
                        }
                        <FormField control={form.control} name="companyOrAuthority" render={({ field }) => (
                             <FormItem><FormLabel>{selectedPaymentType === 'Insurance' ? 'Insurance Company' : 'RTO Authority'}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                </div>
            )}
            
            {/* Other Details */}
             <div className="border p-4 rounded-md space-y-4">
                 <h3 className="text-lg font-semibold border-b pb-2">Other Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormField control={form.control} name="invoiceNumber" render={({ field }) => (
                        <FormItem><FormLabel>Invoice / Reference No.</FormLabel><FormControl><Input placeholder="e.g., INV-2024-001" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="balanceDue" render={({ field }) => (
                        <FormItem><FormLabel>Balance Due (Optional)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="notes" render={({ field }) => (
                        <FormItem className="md:col-span-2"><FormLabel>Notes / Remarks</FormLabel><FormControl><Textarea placeholder="Add any relevant notes..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormItem className="md:col-span-2">
                        <FormLabel>Supporting Document (Optional)</FormLabel>
                        <FormControl>
                            <Input type="file" className="h-auto p-0 border-none file:h-10 file:bg-muted file:border-0 file:rounded-md file:mr-4 file:px-4"/>
                        </FormControl>
                         <FormMessage />
                    </FormItem>
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
