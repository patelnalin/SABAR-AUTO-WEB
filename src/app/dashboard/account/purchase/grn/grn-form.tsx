
"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { grnSchema, GrnPayload } from "./schema";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, PlusCircle, Save, Trash2, XCircle, Upload } from "lucide-react";
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
import { MOCK_PO_DETAILS } from "./data";

interface GrnFormProps {
    grn?: GrnPayload;
    onSubmit: (values: GrnPayload) => Promise<void>;
    isSubmitting: boolean;
}

const mockSuppliers = ["Reliable Auto Parts", "Bharat Tyres", "Engine Masters"];
const mockBranches = ["Pune Kothrud", "Mumbai Andheri", "Pune Viman Nagar"];
const mockPoNumbers = MOCK_PO_DETAILS.map(po => po.poNumber);

const mockModels = MOCK_PO_DETAILS.flatMap(po => po.items).map(item => ({
    code: item.modelCode,
    name: item.modelName,
    hsn: item.hsnCode,
    chassisNo: item.chassisNo,
    engineNo: item.engineNo
}));

const mockColors = ["Racing Red", "Stealth Black", "Pearl White", "Cosmic Blue"];


export function GrnForm({ grn, onSubmit, isSubmitting }: GrnFormProps) {
    const router = useRouter();

    const form = useForm<GrnPayload>({
        resolver: zodResolver(grnSchema),
        defaultValues: grn || {
            grnDate: new Date(),
            invoiceDate: new Date(),
            branch: "",
            supplierName: "",
            poNumber: "",
            invoiceNo: "",
            truckNo: "",
            lrNo: "",
            items: [{
                modelCode: "",
                modelName: "",
                hsnCode: "",
                color: "",
                chassisNo: "",
                engineNo: "",
                rate: 0,
                qty: 1,
                discount: 0,
                igst: 0,
                amount: 0,
            }]
        },
    });

    const { fields: itemFields, append: appendItem, remove: removeItem, replace: replaceItems } = useFieldArray({
        control: form.control,
        name: "items",
    });
    
    const watchedItems = form.watch("items");
    const selectedPoNumber = form.watch("poNumber");

    useEffect(() => {
        if (selectedPoNumber) {
            const poDetails = MOCK_PO_DETAILS.find(po => po.poNumber === selectedPoNumber);
            if (poDetails) {
                form.setValue("branch", poDetails.branch);
                form.setValue("supplierName", poDetails.supplierName);
                form.setValue("invoiceNo", poDetails.invoiceNo);
                form.setValue("invoiceDate", poDetails.invoiceDate);
                form.setValue("truckNo", poDetails.truckNo);
                form.setValue("lrNo", poDetails.lrNo);
                
                const expandedItems = poDetails.items.flatMap(item => {
                    const qty = item.qty || 1;
                    if (qty > 1) {
                        return Array.from({ length: qty }, (_, i) => ({
                            ...item,
                            qty: 1, // Each row represents a single quantity
                            chassisNo: '', // Clear chassis/engine for individual entry
                            engineNo: '',
                        }));
                    }
                    return { ...item, qty: 1 };
                });
                replaceItems(expandedItems);
            }
        }
    }, [selectedPoNumber, form, replaceItems]);

    useEffect(() => {
        watchedItems.forEach((item, index) => {
            const rate = Number(item.rate) || 0;
            const qty = Number(item.qty) || 0;
            const discount = Number(item.discount) || 0;
            
            const baseAmount = (rate * qty) - discount;
            const igstAmount = baseAmount * 0.28; // 28% IGST
            const totalAmount = baseAmount + igstAmount;

            form.setValue(`items.${index}.igst`, igstAmount, { shouldValidate: true });
            form.setValue(`items.${index}.amount`, totalAmount, { shouldValidate: true });
        });
    }, [watchedItems, form]);


    return (
       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create Goods Receipt Note (GRN)</CardTitle>
                    <CardDescription>Enter details of the received goods.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField control={form.control} name="grnNumber" render={({ field }) => (
                        <FormItem><FormLabel>GRN Number</FormLabel><FormControl><Input placeholder="Auto-generated" {...field} className="h-8" disabled /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="grnDate" render={({ field }) => (
                         <FormItem className="flex flex-col pt-2"><FormLabel>GRN Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("h-8 pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "dd/MM/yyyy") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="poNumber" render={({ field }) => (
                        <FormItem><FormLabel>PO Number</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="h-8"><SelectValue /></SelectTrigger></FormControl><SelectContent>{mockPoNumbers.map(po => <SelectItem key={po} value={po}>{po}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="branch" render={({ field }) => (
                        <FormItem><FormLabel>Branch</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-8"><SelectValue /></SelectTrigger></FormControl><SelectContent>{mockBranches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="supplierName" render={({ field }) => (
                        <FormItem><FormLabel>Supplier Name</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-8"><SelectValue /></SelectTrigger></FormControl><SelectContent>{mockSuppliers.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="invoiceNo" render={({ field }) => (
                        <FormItem><FormLabel>Invoice No.</FormLabel><FormControl><Input {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="invoiceDate" render={({ field }) => (
                         <FormItem className="flex flex-col pt-2"><FormLabel>Invoice Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("h-8 pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(new Date(field.value), "dd/MM/yyyy") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="truckNo" render={({ field }) => (
                        <FormItem><FormLabel>Truck No.</FormLabel><FormControl><Input {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="lrNo" render={({ field }) => (
                        <FormItem><FormLabel>LR No.</FormLabel><FormControl><Input {...field} className="h-8" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormItem className="lg:col-span-2">
                        <FormLabel>Scanned Invoice (Optional)</FormLabel>
                        <FormControl>
                             <Input id="scannedInvoice" type="file" className="sr-only" />
                        </FormControl>
                        <label htmlFor="scannedInvoice" className="flex items-center justify-center gap-2 cursor-pointer h-8 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <Upload className="h-4 w-4" />
                            Upload File
                        </label>
                         <FormMessage />
                    </FormItem>
                </CardContent>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle>Received Items</CardTitle>
                    <CardDescription>Details of each vehicle received.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">Seq No</TableHead>
                                    <TableHead>Model Code</TableHead>
                                    <TableHead>Model Name</TableHead>
                                    <TableHead>HSN Code</TableHead>
                                    <TableHead>Color</TableHead>
                                    <TableHead>Chassis No</TableHead>
                                    <TableHead>Engine No</TableHead>
                                    <TableHead>Rate</TableHead>
                                    <TableHead>Qty</TableHead>
                                    <TableHead>Discount</TableHead>
                                    <TableHead>IGST (28%)</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {itemFields.map((field, index) => (
                                    <TableRow key={field.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                             <Controller control={form.control} name={`items.${index}.modelCode`} render={({ field: controllerField }) => (
                                                <Select onValueChange={(value) => {
                                                    const selectedModel = mockModels.find(m => `${m.code}-${m.chassisNo}` === value);
                                                    if(selectedModel) {
                                                        form.setValue(`items.${index}.modelName`, selectedModel.name);
                                                        form.setValue(`items.${index}.hsnCode`, selectedModel.hsn);
                                                        form.setValue(`items.${index}.engineNo`, selectedModel.engineNo);
                                                        form.setValue(`items.${index}.chassisNo`, selectedModel.chassisNo);
                                                        controllerField.onChange(selectedModel.code);
                                                    } else {
                                                        controllerField.onChange(value);
                                                    }
                                                }} value={`${controllerField.value}-${form.getValues(`items.${index}.chassisNo`)}`}>
                                                    <FormControl><SelectTrigger className="h-8 w-48"><SelectValue /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        {mockModels.map(m => (
                                                            <SelectItem key={`${m.code}-${m.chassisNo}`} value={`${m.code}-${m.chassisNo}`}>
                                                                {m.code} ({m.chassisNo} / {m.engineNo})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )} />
                                        </TableCell>
                                        <TableCell><Input {...form.register(`items.${index}.modelName`)} className="h-8" readOnly /></TableCell>
                                        <TableCell><Input {...form.register(`items.${index}.hsnCode`)} className="h-8" readOnly /></TableCell>
                                        <TableCell>
                                            <Controller control={form.control} name={`items.${index}.color`} render={({ field: controllerField }) => (
                                                <Select onValueChange={controllerField.onChange} value={controllerField.value}>
                                                    <FormControl><SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger></FormControl>
                                                    <SelectContent>{mockColors.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                                </Select>
                                            )} />
                                        </TableCell>
                                        <TableCell><Input {...form.register(`items.${index}.chassisNo`)} className="h-8" /></TableCell>
                                        <TableCell><Input {...form.register(`items.${index}.engineNo`)} className="h-8" /></TableCell>
                                        <TableCell><Input type="number" {...form.register(`items.${index}.rate`)} className="h-8 w-28" /></TableCell>
                                        <TableCell><Input type="number" {...form.register(`items.${index}.qty`)} className="h-8 w-20" readOnly /></TableCell>
                                        <TableCell><Input type="number" {...form.register(`items.${index}.discount`)} className="h-8 w-24" /></TableCell>
                                        <TableCell><Input type="number" {...form.register(`items.${index}.igst`)} className="h-8 w-28" readOnly /></TableCell>
                                        <TableCell><Input type="number" {...form.register(`items.${index}.amount`)} className="h-8 w-32" readOnly /></TableCell>
                                        <TableCell>
                                            <Button type="button" variant="destructive" size="icon" onClick={() => removeItem(index)} disabled={itemFields.length <= 1}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                     <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => appendItem({ modelCode: '', modelName: '', hsnCode: '', color: '', chassisNo: '', engineNo: '', rate: 0, qty: 1, discount: 0, igst: 0, amount: 0 })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                    </Button>
                 </CardContent>
            </Card>
            
             <CardFooter className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => router.back()}><XCircle className="mr-2 h-4 w-4"/> Cancel</Button>
                <Button type="submit" disabled={isSubmitting}><Save className="mr-2 h-4 w-4"/> Create GRN</Button>
             </CardFooter>
        </form>
       </Form>
    );
}
