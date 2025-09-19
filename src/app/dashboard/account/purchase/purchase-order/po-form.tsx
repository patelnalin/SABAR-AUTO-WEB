
"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { poSchema, PurchaseOrderPayload } from "./schema";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, PlusCircle, Save, Trash2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";
import { Supplier } from "@/app/dashboard/master/supplier/columns";
import { Branch } from "@/app/dashboard/master/branch/columns";

interface PurchaseOrderFormProps {
    po?: PurchaseOrderPayload;
    onSubmit: (values: PurchaseOrderPayload) => Promise<void>;
    isSubmitting: boolean;
    suppliers: Supplier[];
    branches: Branch[];
}

const mockItems = [
    { code: "BJ-PNS200", name: "Pulsar NS200", color: "Red", hsn: "8711" },
    { code: "BJ-D400", name: "Dominar 400", color: "Green", hsn: "8711" },
    { code: "BJ-CETAK", name: "Chetak", color: "White", hsn: "8711" },
    { code: "HN-H2.0", name: "Hornet 2.0", color: "Matte Black", hsn: "8711" },
];

export function PurchaseOrderForm({ po, onSubmit, isSubmitting, suppliers, branches }: PurchaseOrderFormProps) {
    const router = useRouter();
    const form = useForm<PurchaseOrderPayload>({
        resolver: zodResolver(poSchema),
        defaultValues: po || {
            poNumber: "",
            poDate: new Date(),
            supplierName: "",
            branch: "",
            lineItems: [{
                modelCode: "",
                modelName: "",
                color: "",
                hsnCode: "",
                quantity: 1,
                rate: 0,
                discount: 0,
                amount: 0,
            }],
            billAmt: 0,
            invoiceNo: "",
            invoiceDate: undefined,
            transporter: "",
            truckNo: "",
            mobileNo: "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "lineItems",
    });

    const lineItems = form.watch("lineItems");

    useEffect(() => {
        const totalAmount = lineItems.reduce((acc, item) => {
            const quantity = item.quantity || 0;
            const rate = item.rate || 0;
            const discountPercent = item.discount || 0;
            const baseTotal = quantity * rate;
            const discountAmount = baseTotal * (discountPercent / 100);
            return acc + (baseTotal - discountAmount);
        }, 0);
        form.setValue("billAmt", totalAmount);
    }, [lineItems, form]);


    return (
       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Header Fields */}
            <Card>
                <CardHeader><CardTitle>Purchase Order Info</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField control={form.control} name="poNumber" render={({ field }) => (
                        <FormItem><FormLabel>PO Number</FormLabel><FormControl><Input placeholder="System Generated" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="poDate" render={({ field }) => (
                         <FormItem className="flex flex-col pt-2"><FormLabel>PO Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("h-8 pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "dd-MM-yyyy") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="branch" render={({ field }) => (
                        <FormItem>
                           <FormLabel>Branch</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-8">
                                        <SelectValue placeholder="Select a branch" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {branches.map(b => <SelectItem key={b.id} value={b.branchName}>{b.branchName}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="supplierName" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Supplier Name</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-8">
                                        <SelectValue placeholder="Select a supplier" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {suppliers.map(s => <SelectItem key={s.id} value={s.supplierName}>{s.supplierName}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="invoiceNo" render={({ field }) => (
                        <FormItem><FormLabel>Invoice No</FormLabel><FormControl><Input {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="invoiceDate" render={({ field }) => (
                         <FormItem className="flex flex-col pt-2"><FormLabel>INV Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("h-8 pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "dd-MM-yyyy") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="withWithoutForm" render={({ field }) => (
                        <FormItem><FormLabel>W/Out From 1 : W</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="h-8"><SelectValue /></SelectTrigger></FormControl><SelectContent>{["With Form", "Without Form"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="transporter" render={({ field }) => (
                        <FormItem><FormLabel>Transport</FormLabel><FormControl><Input placeholder="Transporter Name" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="truckNo" render={({ field }) => (
                        <FormItem><FormLabel>Truck No.</FormLabel><FormControl><Input placeholder="MH12 AB1234" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="mobileNo" render={({ field }) => (
                        <FormItem><FormLabel>Mobile No.</FormLabel><FormControl><Input placeholder="Driver's Mobile" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="billAmt" render={({ field }) => (
                        <FormItem><FormLabel>Bill Amt</FormLabel><FormControl><Input type="number" {...field} className="h-8" readOnly /></FormControl><FormMessage /></FormItem>
                    )} />
                </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
                 <CardHeader><CardTitle>Line Items</CardTitle></CardHeader>
                 <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Seq No</TableHead>
                                <TableHead className="w-[15%]">Model Code</TableHead>
                                <TableHead className="w-[20%]">Model Name</TableHead>
                                <TableHead>HSN Code</TableHead>
                                <TableHead>Color</TableHead>
                                <TableHead>Qty</TableHead>
                                <TableHead>Rate</TableHead>
                                <TableHead>Discount (%)</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.map((field, index) => {
                                const quantity = form.watch(`lineItems.${index}.quantity`) || 0;
                                const rate = form.watch(`lineItems.${index}.rate`) || 0;
                                const discountPercent = form.watch(`lineItems.${index}.discount`) || 0;
                                const baseTotal = quantity * rate;
                                const discountAmount = baseTotal * (discountPercent / 100);
                                const amount = baseTotal - discountAmount;
                                
                                const currentAmount = form.getValues(`lineItems.${index}.amount`);
                                if(currentAmount !== amount) {
                                  form.setValue(`lineItems.${index}.amount`, amount);
                                }

                                return (
                                <TableRow key={field.id}>
                                     <TableCell>{index + 1}</TableCell>
                                     <TableCell>
                                        <Controller control={form.control} name={`lineItems.${index}.modelCode`} render={({ field: controllerField }) => (
                                            <Select onValueChange={(value) => {
                                                const selectedItem = mockItems.find(i => i.code === value);
                                                if (selectedItem) {
                                                    form.setValue(`lineItems.${index}.modelName`, selectedItem.name);
                                                    form.setValue(`lineItems.${index}.color`, selectedItem.color);
                                                    form.setValue(`lineItems.${index}.hsnCode`, selectedItem.hsn);
                                                }
                                                controllerField.onChange(value);
                                            }} value={controllerField.value}>
                                                <SelectTrigger className="h-8"><SelectValue placeholder="Select Code" /></SelectTrigger>
                                                <SelectContent>{mockItems.map(i => <SelectItem key={i.code} value={i.code}>{i.code}</SelectItem>)}</SelectContent>
                                            </Select>
                                        )} />
                                    </TableCell>
                                    <TableCell><Input className="h-8" {...form.register(`lineItems.${index}.modelName`)} /></TableCell>
                                    <TableCell><Input className="h-8" {...form.register(`lineItems.${index}.hsnCode`)} /></TableCell>
                                    <TableCell><Input className="h-8" {...form.register(`lineItems.${index}.color`)} /></TableCell>
                                    <TableCell><Input type="number" className="h-8" {...form.register(`lineItems.${index}.quantity`)} /></TableCell>
                                    <TableCell><Input type="number" className="h-8" {...form.register(`lineItems.${index}.rate`)} /></TableCell>
                                    <TableCell><Input type="number" className="h-8" {...form.register(`lineItems.${index}.discount`)} /></TableCell>
                                    <TableCell className="text-right font-medium">{amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</TableCell>
                                    <TableCell>
                                        <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                    <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ modelCode: "", modelName: "", color: "", hsnCode: "", quantity: 1, rate: 0, discount: 0, amount: 0 })}>
                        <PlusCircle className="mr-2" /> Add Item
                    </Button>
                 </CardContent>
                 <CardFooter className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => router.back()}><XCircle className="mr-2"/> Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}><Save className="mr-2"/> Save Purchase Order</Button>
                 </CardFooter>
            </Card>
        </form>
       </Form>
    );
}
