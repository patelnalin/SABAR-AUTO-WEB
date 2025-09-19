
"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceSchema, InvoicePayload } from "./schema";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";

interface InvoiceFormProps {
    invoice?: InvoicePayload;
    onSubmit: (values: InvoicePayload) => Promise<void>;
    isSubmitting: boolean;
}

const mockSuppliers = ["Reliable Auto Parts", "Bharat Tyres", "Engine Masters", "Premium Oils Ltd."];
const mockPaymentTerms = ["Net 30", "Net 60", "Advance", "On Delivery"];
const mockItems = [
    { code: "BJ-PNS200", name: "Pulsar NS200", hsn: "8711", color: "Red" },
    { code: "BJ-D400", name: "Dominar 400", hsn: "8711", color: "Green" },
    { code: "BJ-CETAK", name: "Chetak", hsn: "8711", color: "White" },
    { code: "HN-H2.0", name: "Hornet 2.0", hsn: "8711", color: "Matte Black" },
];
const mockBranches = ["Pune Kothrud", "Mumbai Andheri", "Pune Viman Nagar"];

const mockPurchaseOrdersData = [
    {
        poNumber: "PO-2024-001",
        supplierName: "Reliable Auto Parts",
        deliveryAddress: "123 Auto Market, Delhi",
        lineItems: [
            { modelCode: "BJ-PNS200", modelName: "Pulsar NS200", hsnCode: "8711", color: "Red", chassisNumber: "CHNS200R001", engineNumber: "ENNS200R001", quantity: 1, rate: 140000, discount: 5, amount: 0 },
            { modelCode: "BJ-D400", modelName: "Dominar 400", hsnCode: "8711", color: "Green", chassisNumber: "CHD400G001", engineNumber: "END400G001", quantity: 1, rate: 230000, discount: 10, amount: 0 }
        ]
    },
     {
        poNumber: "PO-2024-002",
        supplierName: "Bharat Tyres",
        deliveryAddress: "456 Tyre Gali, Mumbai",
        lineItems: [
            { modelCode: "BJ-CETAK", modelName: "Chetak", hsnCode: "8711", color: "White", chassisNumber: "CHCETAKW001", engineNumber: "ENCETAKW001", quantity: 2, rate: 150000, discount: 0, amount: 0 }
        ]
    },
    {
        poNumber: "PO-2024-003",
        supplierName: "Engine Masters",
        deliveryAddress: "789 Industrial Area, Pune",
        lineItems: [
             { modelCode: "HN-H2.0", name: "Hornet 2.0", hsn: "8711", color: "Matte Black", chassisNumber: "CHH20MB001", engineNumber: "ENH20MB001", quantity: 1, rate: 135000, discount: 0, amount: 0 },
        ]
    }
];

const mockPurchaseOrders = mockPurchaseOrdersData.map(po => po.poNumber);


export function InvoiceForm({ invoice, onSubmit, isSubmitting }: InvoiceFormProps) {
    const router = useRouter();
    const form = useForm<InvoicePayload>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: invoice || {
            invoiceDate: new Date(),
            status: "Draft",
            currency: "INR",
            lineItems: [{
                modelCode: "",
                modelName: "",
                hsnCode: "",
                color: "",
                chassisNumber: "",
                engineNumber: "",
                quantity: 1,
                rate: 0,
                discount: 0,
                amount: 0,
            }],
            subtotal: 0,
            totalDiscount: 0,
            sgst: 0,
            cgst: 0,
            shippingCharges: 0,
            grandTotal: 0,
        },
    });

    const { fields, append, remove, replace } = useFieldArray({
        control: form.control,
        name: "lineItems",
    });

    const lineItems = form.watch("lineItems");
    const shippingCharges = form.watch("shippingCharges");
    const selectedPoNumber = form.watch("poNumber");

    useEffect(() => {
        if (selectedPoNumber) {
            const selectedPO = mockPurchaseOrdersData.find(po => po.poNumber === selectedPoNumber);
            if (selectedPO) {
                form.setValue("supplierName", selectedPO.supplierName);
                form.setValue("deliveryAddress", selectedPO.deliveryAddress);
                replace(selectedPO.lineItems);
            }
        }
    }, [selectedPoNumber, form, replace]);


    useEffect(() => {
        let subtotal = 0;
        let totalDiscount = 0;

        lineItems.forEach((item, index) => {
            const quantity = item.quantity || 0;
            const rate = item.rate || 0;
            const discountPercent = item.discount || 0;
            
            const baseTotal = quantity * rate;
            const discountAmount = baseTotal * (discountPercent / 100);
            const lineTotal = baseTotal - discountAmount;

            form.setValue(`lineItems.${index}.amount`, lineTotal, { shouldValidate: true });
            
            subtotal += baseTotal;
            totalDiscount += discountAmount;
        });
        
        const taxableAmount = subtotal - totalDiscount;
        const sgst = taxableAmount * 0.14;
        const cgst = taxableAmount * 0.14;
        const grandTotal = taxableAmount + sgst + cgst + (shippingCharges || 0);

        form.setValue("subtotal", subtotal, { shouldValidate: true });
        form.setValue("totalDiscount", totalDiscount, { shouldValidate: true });
        form.setValue("sgst", sgst, { shouldValidate: true });
        form.setValue("cgst", cgst, { shouldValidate: true });
        form.setValue("grandTotal", grandTotal, { shouldValidate: true });

    }, [lineItems, shippingCharges, form]);


    return (
       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Header Fields */}
            <Card>
                <CardHeader><CardTitle>Purchase Invoice Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField control={form.control} name="invoiceNumber" render={({ field }) => (
                        <FormItem><FormLabel>Po Invoice No</FormLabel><FormControl><Input placeholder="INV-2024-001" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="invoiceDate" render={({ field }) => (
                         <FormItem className="flex flex-col pt-2"><FormLabel>Po Invoice Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("h-8 pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "dd/MM/yyyy") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="poNumber" render={({ field }) => (
                        <FormItem><FormLabel>PO Number</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="h-8"><SelectValue placeholder="Select Purchase Order"/></SelectTrigger></FormControl><SelectContent>{mockPurchaseOrders.map(po => <SelectItem key={po} value={po}>{po}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="branch" render={({ field }) => (
                        <FormItem><FormLabel>Branch</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="h-8"><SelectValue placeholder="Select Branch"/></SelectTrigger></FormControl><SelectContent>{mockBranches.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="supplierName" render={({ field }) => (
                        <FormItem><FormLabel>Supplier Name</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="h-8"><SelectValue placeholder="Select Supplier" /></SelectTrigger></FormControl><SelectContent>{mockSuppliers.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="grnNumber" render={({ field }) => (
                        <FormItem><FormLabel>GRN Number</FormLabel><FormControl><Input placeholder="Optional" {...field} className="h-8"/></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="paymentTerms" render={({ field }) => (
                        <FormItem><FormLabel>Payment Terms</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="h-8"><SelectValue placeholder="Select Terms" /></SelectTrigger></FormControl><SelectContent>{mockPaymentTerms.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="status" render={({ field }) => (
                        <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="h-8"><SelectValue /></SelectTrigger></FormControl><SelectContent>{["Draft", "Pending Approval", "Approved", "Paid", "Cancelled"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="deliveryAddress" render={({ field }) => (
                        <FormItem className="md:col-span-2 lg:col-span-4"><FormLabel>Delivery Address</FormLabel><FormControl><Textarea placeholder="Full delivery address for the original PO" {...field}/></FormControl><FormMessage /></FormItem>
                    )} />
                </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
                 <CardHeader><CardTitle>Invoice Items</CardTitle></CardHeader>
                 <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Model Code</TableHead>
                                <TableHead>Model Name</TableHead>
                                <TableHead>HSN Code</TableHead>
                                <TableHead>Color</TableHead>
                                <TableHead>Chassis No</TableHead>
                                <TableHead>Engine No</TableHead>
                                <TableHead>Qty</TableHead>
                                <TableHead>Rate</TableHead>
                                <TableHead>Discount (%)</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.map((field, index) => (
                                <TableRow key={field.id}>
                                     <TableCell>
                                        <Controller control={form.control} name={`lineItems.${index}.modelCode`} render={({ field: controllerField }) => (
                                            <Select onValueChange={(value) => {
                                                const selectedItem = mockItems.find(i => i.code === value);
                                                if (selectedItem) {
                                                    form.setValue(`lineItems.${index}.modelName`, selectedItem.name);
                                                    form.setValue(`lineItems.${index}.hsnCode`, selectedItem.hsn);
                                                    form.setValue(`lineItems.${index}.color`, selectedItem.color);
                                                }
                                                controllerField.onChange(value);
                                            }} value={controllerField.value}>
                                                <SelectTrigger className="h-8 w-[120px]"><SelectValue placeholder="Select" /></SelectTrigger>
                                                <SelectContent>{mockItems.map(i => <SelectItem key={i.code} value={i.code}>{i.code}</SelectItem>)}</SelectContent>
                                            </Select>
                                        )} />
                                    </TableCell>
                                    <TableCell><Input {...form.register(`lineItems.${index}.modelName`)} className="h-8 w-[150px]" /></TableCell>
                                    <TableCell><Input {...form.register(`lineItems.${index}.hsnCode`)} className="h-8 w-[100px]" /></TableCell>
                                    <TableCell><Input {...form.register(`lineItems.${index}.color`)} className="h-8 w-[100px]" /></TableCell>
                                    <TableCell><Input {...form.register(`lineItems.${index}.chassisNumber`)} className="h-8 w-[150px]" /></TableCell>
                                    <TableCell><Input {...form.register(`lineItems.${index}.engineNumber`)} className="h-8 w-[150px]" /></TableCell>
                                    <TableCell><Input type="number" {...form.register(`lineItems.${index}.quantity`)} className="h-8 w-[70px]" /></TableCell>
                                    <TableCell><Input type="number" {...form.register(`lineItems.${index}.rate`)} className="h-8 w-[100px]" /></TableCell>
                                    <TableCell><Input type="number" {...form.register(`lineItems.${index}.discount`)} className="h-8 w-[80px]" /></TableCell>
                                    <TableCell className="text-right font-medium">{form.watch(`lineItems.${index}.amount`).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</TableCell>
                                    <TableCell>
                                        <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ modelCode: "", modelName: "", hsnCode: "", color: "", chassisNumber: "", engineNumber: "", quantity: 1, rate: 0, discount: 0, amount: 0 })}>
                        <PlusCircle className="mr-2" /> Add Item
                    </Button>
                 </CardContent>
            </Card>

             {/* Footer */}
             <Card>
                 <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
                 <CardContent>
                    <div className="flex justify-end">
                        <div className="w-full max-w-sm space-y-2">
                             <div className="flex justify-between"><span>Subtotal:</span><span>{form.watch('subtotal').toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span></div>
                             <div className="flex justify-between"><span>Total Discount:</span><span className="text-green-600">-{form.watch('totalDiscount').toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span></div>
                             <div className="flex justify-between"><span>SGST (14%):</span><span>+{form.watch('sgst').toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span></div>
                             <div className="flex justify-between"><span>CGST (14%):</span><span>+{form.watch('cgst').toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span></div>
                             <div className="flex justify-between items-center">
                                <FormLabel>Shipping/Other Charges:</FormLabel>
                                <FormField control={form.control} name="shippingCharges" render={({ field }) => (
                                    <Input type="number" className="w-24 h-8" {...field} />
                                 )} />
                             </div>
                             <hr/>
                             <div className="flex justify-between font-bold text-lg"><span>Grand Total:</span><span>{form.watch('grandTotal').toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span></div>
                        </div>
                    </div>
                 </CardContent>
                 <CardFooter className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => router.back()}><XCircle className="mr-2"/> Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}><Save className="mr-2"/> Save Invoice</Button>
                 </CardFooter>
             </Card>
        </form>
       </Form>
    );
}

    

    