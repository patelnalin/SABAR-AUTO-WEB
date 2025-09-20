
"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { billSchema, type BillProductPayload } from "./schema";

interface BillFormProps {
    bill?: z.infer<typeof billSchema>;
    onSubmit: (values: z.infer<typeof billSchema>) => Promise<void>;
    isSubmitting: boolean;
}

export function BillForm({ bill, onSubmit, isSubmitting }: BillFormProps) {
    const router = useRouter();

    const form = useForm<z.infer<typeof billSchema>>({
        resolver: zodResolver(billSchema),
        defaultValues: bill || {
            billDate: new Date(),
            customerName: "",
            mobile: "",
            village: "",
            city: "",
            vehicleModel: "",
            chassisNo: "",
            engineNo: "",
            certificateNo: "",
            meterNo: "",
            products: [{ productName: "", qty: 1, rate: 0, amount: 0 }],
            totalAmount: 0,
            discount: 0,
            sgst: 0,
            cgst: 0,
            grandTotal: 0,
        },
    });

    const { fields: productFields, append: appendProduct, remove: removeProduct } = useFieldArray({
        control: form.control,
        name: "products",
    });

    const watchedProducts = form.watch("products");
    const watchedDiscount = form.watch("discount");

    useEffect(() => {
        let totalAmount = 0;
        watchedProducts.forEach((product, index) => {
            const qty = Number(product.qty) || 0;
            const rate = Number(product.rate) || 0;
            const amount = qty * rate;
            form.setValue(`products.${index}.amount`, amount, { shouldValidate: true });
            totalAmount += amount;
        });

        const discountValue = Number(watchedDiscount) || 0;
        const taxableAmount = totalAmount - discountValue;
        const sgst = taxableAmount * 0.09;
        const cgst = taxableAmount * 0.09;
        const grandTotal = taxableAmount + sgst + cgst;

        form.setValue("totalAmount", totalAmount);
        form.setValue("sgst", sgst);
        form.setValue("cgst", cgst);
        form.setValue("grandTotal", grandTotal);

    }, [watchedProducts, watchedDiscount, form]);
    
    const handleReset = () => {
        form.reset();
    };

    return (
       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create Meetar Bill</CardTitle>
                    <CardDescription>Enter the details for the new bill.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField control={form.control} name="billId" render={({ field }) => (
                        <FormItem><FormLabel>Bill ID</FormLabel><FormControl><Input placeholder="Auto-generated" {...field} className="h-8" disabled /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="billDate" render={({ field }) => (
                         <FormItem className="flex flex-col pt-2"><FormLabel>Bill Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("h-8 pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "dd/MM/yyyy") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="customerName" render={({ field }) => (
                        <FormItem className="lg:col-span-2"><FormLabel>Customer Name</FormLabel><FormControl><Input placeholder="Customer Name" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="mobile" render={({ field }) => (
                        <FormItem><FormLabel>Mobile No.</FormLabel><FormControl><Input placeholder="9876543210" {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="village" render={({ field }) => (
                        <FormItem><FormLabel>Village / Town</FormLabel><FormControl><Input {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="vehicleModel" render={({ field }) => (
                        <FormItem><FormLabel>Vehicle Model</FormLabel><FormControl><Input {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="chassisNo" render={({ field }) => (
                        <FormItem><FormLabel>Chassis No.</FormLabel><FormControl><Input {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="engineNo" render={({ field }) => (
                        <FormItem><FormLabel>Engine No.</FormLabel><FormControl><Input {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="certificateNo" render={({ field }) => (
                        <FormItem><FormLabel>Certificate No.</FormLabel><FormControl><Input {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="meterNo" render={({ field }) => (
                        <FormItem><FormLabel>Meter No.</FormLabel><FormControl><Input {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                    )} />
                </CardContent>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead className="w-24">Qty</TableHead>
                                    <TableHead className="w-32">Rate</TableHead>
                                    <TableHead className="w-32 text-right">Amount</TableHead>
                                    <TableHead className="w-20">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {productFields.map((field, index) => (
                                    <TableRow key={field.id}>
                                        <TableCell><Input {...form.register(`products.${index}.productName`)} className="h-8" /></TableCell>
                                        <TableCell><Input type="number" {...form.register(`products.${index}.qty`)} className="h-8" /></TableCell>
                                        <TableCell><Input type="number" {...form.register(`products.${index}.rate`)} className="h-8" /></TableCell>
                                        <TableCell><Input type="number" {...form.register(`products.${index}.amount`)} className="h-8 text-right" readOnly /></TableCell>
                                        <TableCell>
                                            <Button type="button" variant="destructive" size="icon" onClick={() => removeProduct(index)} disabled={productFields.length <= 1}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                     <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => appendProduct({ productName: '', qty: 1, rate: 0, amount: 0 })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                 </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex justify-end">
                        <div className="w-full max-w-sm space-y-2">
                            <div className="flex justify-between"><span>Total Amount:</span><span>{form.watch('totalAmount').toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span></div>
                            <div className="flex justify-between items-center">
                                <FormLabel>Discount:</FormLabel>
                                <FormField control={form.control} name="discount" render={({ field }) => <Input type="number" className="w-28 h-8" {...field} />} />
                            </div>
                            <div className="flex justify-between"><span>SGST (9%):</span><span>+{form.watch('sgst').toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span></div>
                            <div className="flex justify-between"><span>CGST (9%):</span><span>+{form.watch('cgst').toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span></div>
                            <hr />
                            <div className="flex justify-between font-bold text-lg"><span>Grand Total:</span><span>{form.watch('grandTotal').toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            
             <CardFooter className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={handleReset}>Reset</Button>
                <Button type="button" variant="outline" onClick={() => router.back()}><XCircle className="mr-2 h-4 w-4"/> Cancel</Button>
                <Button type="submit" disabled={isSubmitting}><Save className="mr-2 h-4 w-4"/> Create Bill</Button>
             </CardFooter>
        </form>
       </Form>
    );
}
