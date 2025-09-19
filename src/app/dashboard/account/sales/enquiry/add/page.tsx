
"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { Calendar as CalendarIcon, PlusCircle, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const enquirySchema = z.object({
  // Customer Details
  customerName: z.string().min(2, "Customer name must be at least 2 characters."),
  gender: z.enum(["Male", "Female", "Other"]),
  dateOfBirth: z.date().optional(),
  contactNumber: z.string().regex(/^\d{10}$/, "Must be a 10-digit contact number."),
  alternateNumber: z.string().optional(),
  email: z.string().email("Invalid email address.").optional().or(z.literal('')),
  addressStreet: z.string().min(3, "Street is required"),
  addressCity: z.string().min(3, "City is required"),
  addressState: z.string().min(2, "State is required"),
  addressPinCode: z.string().regex(/^\d{6}$/, "Must be a 6-digit PIN code."),
  idProofType: z.enum(["Aadhar", "PAN", "Driving License", "Passport"]),
  idProofNumber: z.string().min(5, "ID proof number is required."),

  // Vehicle Details
  vehicleType: z.enum(["Auto", "Rixa", "E-Rixa", "Other"]),
  vehicleBrand: z.string().min(2, "Brand is required."),
  vehicleModel: z.string().min(2, "Model is required."),
  variantTrim: z.string().optional(),
  fuelType: z.enum(["Petrol", "Diesel", "Electric", "Hybrid"]),
  transmission: z.enum(["Manual", "Automatic"]),
  colorPreference: z.string().optional(),
  yearOfManufacture: z.coerce.number().min(1990).max(new Date().getFullYear() + 1),
  budgetMin: z.coerce.number().optional(),
  budgetMax: z.coerce.number().optional(),
  expectedDeliveryDate: z.date().optional(),

  // Enquiry Information
  enquiryDate: z.date(),
  enquirySource: z.enum(["Walk-in", "Website", "Referral", "Call"]),
  salesExecutive: z.string().min(2, "Sales executive name is required."),
  status: z.enum(["New", "In Progress", "Converted", "Closed", "Lost"]),
  preferredCommunication: z.enum(["Call", "WhatsApp", "Email", "SMS"]),
  followUpDate: z.date().optional(),
  notes: z.string().optional(),
  
  // Payment & Finance
  paymentMode: z.enum(["Cash", "Loan", "Lease"]),
  downPayment: z.coerce.number().optional(),
  loanRequirement: z.boolean().default(false),
  financeCompany: z.string().optional(),
  emiBudget: z.coerce.number().optional(),

  // Trade-in
  tradeIn: z.boolean().default(false),
  existingVehicleBrand: z.string().optional(),
  existingVehicleYear: z.coerce.number().optional(),
  approximateValue: z.coerce.number().optional(),
});

export default function AddSalesEnquiryPage() {
    const { toast } = useToast();
    const router = useRouter();
    const form = useForm<z.infer<typeof enquirySchema>>({
        resolver: zodResolver(enquirySchema),
        defaultValues: {
            enquiryDate: new Date(),
            status: "New",
            loanRequirement: false,
            tradeIn: false,
            customerName: "",
            contactNumber: "",
            email: "",
            addressStreet: "",
            addressCity: "",
            addressState: "",
            addressPinCode: "",
            idProofNumber: "",
            vehicleBrand: "Bajaj",
            vehicleModel: "",
            salesExecutive: "",
        },
    });

    const onSubmit = (values: z.infer<typeof enquirySchema>) => {
        const newEnquiry = { id: uuidv4(), ...values };
        console.log("New Enquiry:", newEnquiry);
        toast({ title: "Success", description: "New enquiry added successfully." });
        router.push("/dashboard/account/sales/enquiry");
    };

    return (
        <Card className="shadow-lg max-w-7xl mx-auto">
            <CardHeader>
                <CardTitle>Add New Sales Enquiry</CardTitle>
                <CardDescription>Fill in the details below to create a new enquiry record.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-8">
                        {/* Customer Details */}
                        <div>
                            <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Customer Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <FormField control={form.control} name="customerName" render={({ field }) => (
                                    <FormItem><FormLabel>Customer Name</FormLabel><FormControl><Input placeholder="Full Name" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="gender" render={({ field }) => (
                                    <FormItem><FormLabel>Gender</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{["Male", "Female", "Other"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                                    <FormItem className="flex flex-col pt-2"><FormLabel>Date of Birth</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "dd/MM/yyyy") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} captionLayout="dropdown-buttons" fromYear={1950} toYear={new Date().getFullYear()} disabled={(date) => date > new Date()} /></PopoverContent></Popover><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="contactNumber" render={({ field }) => (
                                    <FormItem><FormLabel>Contact Number</FormLabel><FormControl><Input placeholder="10-digit mobile" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="alternateNumber" render={({ field }) => (
                                    <FormItem><FormLabel>Alternate Number</FormLabel><FormControl><Input placeholder="Optional" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="example@mail.com" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="addressStreet" render={({ field }) => (
                                    <FormItem className="lg:col-span-2"><FormLabel>Street Address</FormLabel><FormControl><Input placeholder="House No, Street Name" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="addressCity" render={({ field }) => (
                                    <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="City" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="addressState" render={({ field }) => (
                                    <FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="State" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="addressPinCode" render={({ field }) => (
                                    <FormItem><FormLabel>Pin Code</FormLabel><FormControl><Input placeholder="6-digit PIN" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="idProofType" render={({ field }) => (
                                    <FormItem><FormLabel>ID Proof Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{["Aadhar", "PAN", "Driving License", "Passport"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="idProofNumber" render={({ field }) => (
                                    <FormItem><FormLabel>ID Proof Number</FormLabel><FormControl><Input placeholder="ID Number" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        </div>
                        
                        {/* Enquiry & Vehicle Details */}
                         <div>
                            <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Enquiry & Vehicle Details</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <FormField control={form.control} name="enquiryDate" render={({ field }) => (
                                    <FormItem className="flex flex-col pt-2"><FormLabel>Enquiry Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "dd/MM/yyyy") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="enquirySource" render={({ field }) => (
                                    <FormItem><FormLabel>Enquiry Source</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{["Walk-in", "Website", "Referral", "Call"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="salesExecutive" render={({ field }) => (
                                    <FormItem><FormLabel>Sales Executive</FormLabel><FormControl><Input placeholder="Assigned To" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="status" render={({ field }) => (
                                    <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{["New", "In Progress", "Converted", "Closed", "Lost"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="vehicleType" render={({ field }) => (
                                    <FormItem><FormLabel>Vehicle Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{["Auto", "Rixa", "E-Rixa", "Other"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="vehicleBrand" render={({ field }) => (
                                    <FormItem><FormLabel>Vehicle Brand</FormLabel><FormControl><Input placeholder="e.g., Bajaj" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="vehicleModel" render={({ field }) => (
                                    <FormItem><FormLabel>Vehicle Model</FormLabel><FormControl><Input placeholder="e.g., RE" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                 <FormField control={form.control} name="variantTrim" render={({ field }) => (
                                    <FormItem><FormLabel>Variant / Trim</FormLabel><FormControl><Input placeholder="Optional" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="fuelType" render={({ field }) => (
                                    <FormItem><FormLabel>Fuel Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{["Petrol", "Diesel", "Electric", "Hybrid"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="transmission" render={({ field }) => (
                                    <FormItem><FormLabel>Transmission</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{["Manual", "Automatic"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                                )} />
                                 <FormField control={form.control} name="colorPreference" render={({ field }) => (
                                    <FormItem><FormLabel>Color Preference</FormLabel><FormControl><Input placeholder="Optional" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="yearOfManufacture" render={({ field }) => (
                                    <FormItem><FormLabel>Year of Manufacture</FormLabel><FormControl><Input type="number" placeholder="YYYY" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="budgetMin" render={({ field }) => (
                                    <FormItem><FormLabel>Budget (Min)</FormLabel><FormControl><Input type="number" placeholder="e.g., 500000" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="budgetMax" render={({ field }) => (
                                    <FormItem><FormLabel>Budget (Max)</FormLabel><FormControl><Input type="number" placeholder="e.g., 800000" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                 <FormField control={form.control} name="expectedDeliveryDate" render={({ field }) => (
                                    <FormItem className="flex flex-col pt-2"><FormLabel>Expected Delivery</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "dd/MM/yyyy") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="followUpDate" render={({ field }) => (
                                    <FormItem className="flex flex-col pt-2"><FormLabel>Next Follow-up</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "dd/MM/yyyy") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                                )} />
                             </div>
                        </div>

                        {/* Payment & Finance */}
                        <div>
                            <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Payment & Finance</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <FormField control={form.control} name="paymentMode" render={({ field }) => (
                                    <FormItem><FormLabel>Payment Mode</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{["Cash", "Loan", "Lease"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="downPayment" render={({ field }) => (
                                    <FormItem><FormLabel>Down Payment (₹)</FormLabel><FormControl><Input type="number" placeholder="Optional" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="emiBudget" render={({ field }) => (
                                    <FormItem><FormLabel>EMI Budget (₹)</FormLabel><FormControl><Input type="number" placeholder="Optional" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                 <FormField control={form.control} name="loanRequirement" render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2 pt-8"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Loan Required?</FormLabel></FormItem>
                                )} />
                                <FormField control={form.control} name="financeCompany" render={({ field }) => (
                                    <FormItem className="lg:col-span-3"><FormLabel>Preferred Bank / Finance Co.</FormLabel><FormControl><Input placeholder="Optional" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                             </div>
                        </div>
                        
                        {/* Trade-in */}
                        <div>
                            <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Trade-in / Exchange</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                                 <FormField control={form.control} name="tradeIn" render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2 pt-6"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Exchange Vehicle?</FormLabel></FormItem>
                                )} />
                                <FormField control={form.control} name="existingVehicleBrand" render={({ field }) => (
                                    <FormItem><FormLabel>Existing Vehicle</FormLabel><FormControl><Input placeholder="Brand & Model" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="existingVehicleYear" render={({ field }) => (
                                    <FormItem><FormLabel>Manufacture Year</FormLabel><FormControl><Input type="number" placeholder="YYYY" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="approximateValue" render={({ field }) => (
                                    <FormItem><FormLabel>Approx. Value (₹)</FormLabel><FormControl><Input type="number" placeholder="e.g., 150000" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                             </div>
                        </div>

                         {/* Notes */}
                        <div>
                             <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Notes</h3>
                             <FormField control={form.control} name="notes" render={({ field }) => (
                                <FormItem><FormLabel>Special Requests / Notes</FormLabel><FormControl><Textarea placeholder="Any additional details or comments..." {...field} /></FormControl><FormMessage /></FormItem>
                             )} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => router.back()}><XCircle className="mr-2" /> Cancel</Button>
                        <Button type="submit"><PlusCircle className="mr-2" /> Add Enquiry</Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}


    