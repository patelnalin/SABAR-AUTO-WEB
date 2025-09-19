
"use client";

import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Save, X, PlusCircle } from "lucide-react";
import React, { useEffect } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Booking } from "../data";

const vehicleMakes = {
    "Bajaj": ["Pulsar NS200", "Dominar 400", "Chetak Electric", "Avenger Cruise 220"],
    "TVS": ["Apache RTR 200", "Ronin", "iQube"],
    "Hero": ["Splendor+", "Xtreme 160R", "Destini 125"],
};

const bookingSchema = z.object({
  id: z.string().optional(),
  // Customer Details
  customerName: z.string().min(2, "Name is required."),
  gender: z.enum(["Male", "Female", "Other"]),
  dateOfBirth: z.date().optional(),
  phoneNumber: z.string().regex(/^\d{10}$/, "Must be a 10-digit phone number."),
  alternateNumber: z.string().optional(),
  email: z.string().email("Invalid email address.").optional().or(z.literal('')),
  address: z.object({
    street: z.string().min(3, "Street is required"),
    city: z.string().min(3, "City is required"),
    state: z.string().min(2, "State is required"),
    pincode: z.string().regex(/^\d{6}$/, "Must be a 6-digit PIN code."),
  }),
  idProofType: z.enum(["Aadhar", "PAN", "Driving License", "Passport"]),
  idProofNumber: z.string().min(5, "ID proof number is required."),
  panNumber: z.string().optional(),
  
  // Vehicle Details
  vehicleMake: z.string({ required_error: "Make is required" }),
  vehicleModel: z.string({ required_error: "Model is required" }),
  vehicleColor: z.string().min(2, "Color is required."),
  hsnCode: z.string().optional(),
  engineNumber: z.string().min(5, "Engine No. is required."),
  chassisNumber: z.string().min(5, "Chassis No. is required."),

  // Pricing
  exShowroomPrice: z.coerce.number().min(1, "Price must be greater than 0."),
  discount: z.coerce.number().min(0).optional(),
  sgst: z.coerce.number().min(0).default(0),
  cgst: z.coerce.number().min(0).default(0),
  onRoadPrice: z.coerce.number().min(1, "Price must be greater than 0."),
  
  // Booking
  bookingDate: z.date({ required_error: "Booking date is required." }),
  bookingAmount: z.coerce.number().min(0, "Booking amount cannot be negative."),
  paymentMode: z.enum(["Cash", "UPI", "Bank Transfer", "Loan"]),
  bookingStatus: z.enum(["Pending", "Confirmed", "Cancelled"]),
});


export default function AddBookingPage() {
    const router = useRouter();
    const { toast } = useToast();

  const form = useForm<Booking>({
    // @ts-ignore
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: "",
      gender: "Male",
      phoneNumber: "",
      email: "",
      address: { street: "", city: "", state: "", pincode: "" },
      idProofType: "Aadhar",
      idProofNumber: "",
      vehicleMake: "Bajaj",
      vehicleModel: "Pulsar NS200",
      vehicleColor: "Red",
      engineNumber: "",
      chassisNumber: "",
      exShowroomPrice: 0,
      onRoadPrice: 0,
      bookingDate: new Date(),
      bookingAmount: 1000,
      paymentMode: "UPI",
      bookingStatus: "Pending",
      hsnCode: "",
      discount: 0,
      sgst: 0,
      cgst: 0,
    },
  });

  const selectedMake = form.watch("vehicleMake");
  const exShowroomPrice = form.watch("exShowroomPrice");
  const discount = form.watch("discount");
  
  useEffect(() => {
      const showroomPrice = Number(exShowroomPrice) || 0;
      const discountAmount = Number(discount) || 0;
      
      const sgstAmount = showroomPrice * 0.14;
      const cgstAmount = showroomPrice * 0.14;

      form.setValue("sgst", sgstAmount, { shouldValidate: true });
      form.setValue("cgst", cgstAmount, { shouldValidate: true });

      const onRoadPrice = showroomPrice - discountAmount + sgstAmount + cgstAmount;
      form.setValue("onRoadPrice", onRoadPrice, { shouldValidate: true });
  }, [exShowroomPrice, discount, form]);

  const handleSubmit = (values: Booking) => {
    console.log("New Booking Data:", values);
    toast({ title: "Success", description: "New booking created successfully." });
    router.push("/dashboard/account/sales/saleschallan");
  };


  return (
    <Card className="rounded-lg border bg-card text-card-foreground shadow-lg max-w-7xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Booking</CardTitle>
          <CardDescription>
            Fill in the details to create a new vehicle booking.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <CardContent className="space-y-8">
                {/* Customer Details */}
                <div className="border p-4 rounded-md space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Customer Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField control={form.control} name="customerName" render={({ field }) => (
                        <FormItem><FormLabel>Customer Name</FormLabel><FormControl><Input placeholder="Full Name" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="gender" render={({ field }) => (
                        <FormItem><FormLabel>Gender</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{["Male", "Female", "Other"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                        <FormItem className="flex flex-col pt-2"><FormLabel>Date of Birth</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "dd/MM/yyyy") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} captionLayout="dropdown-buttons" fromYear={1950} toYear={new Date().getFullYear()} /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                        <FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input placeholder="10-digit mobile" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="alternateNumber" render={({ field }) => (
                        <FormItem><FormLabel>Contact Number</FormLabel><FormControl><Input placeholder="Optional alternate number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="address.street" render={({ field }) => (
                        <FormItem className="lg:col-span-2"><FormLabel>Street Address</FormLabel><FormControl><Input placeholder="House No, Street Name" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="address.city" render={({ field }) => (
                        <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="City" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="address.state" render={({ field }) => (
                        <FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="State" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="address.pincode" render={({ field }) => (
                        <FormItem><FormLabel>Pin Code</FormLabel><FormControl><Input placeholder="6-digit PIN" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="idProofType" render={({ field }) => (
                        <FormItem><FormLabel>ID Proof Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{["Aadhar", "PAN", "Driving License", "Passport"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="idProofNumber" render={({ field }) => (
                        <FormItem><FormLabel>ID Proof Number</FormLabel><FormControl><Input placeholder="ID Number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="panNumber" render={({ field }) => (
                        <FormItem><FormLabel>PAN Card Number</FormLabel><FormControl><Input placeholder="Optional" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                </div>

                {/* Vehicle & Pricing Details */}
                <div className="border p-4 rounded-md space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Vehicle & Pricing Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FormField control={form.control} name="vehicleMake" render={({ field }) => (
                        <FormItem><FormLabel>Make (Brand)</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>{Object.keys(vehicleMakes).map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                        </Select><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="vehicleModel" render={({ field }) => (
                        <FormItem><FormLabel>Model</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedMake}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>{(vehicleMakes[selectedMake as keyof typeof vehicleMakes] || []).map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                        </Select><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="vehicleColor" render={({ field }) => (
                        <FormItem><FormLabel>Color</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="hsnCode" render={({ field }) => (
                        <FormItem><FormLabel>HSN Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="engineNumber" render={({ field }) => (
                        <FormItem className="lg:col-span-2"><FormLabel>Engine No.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="chassisNumber" render={({ field }) => (
                        <FormItem className="lg:col-span-2"><FormLabel>Chassis No.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <div className="lg:col-span-4 pt-4 border-t mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <FormField control={form.control} name="exShowroomPrice" render={({ field }) => (
                            <FormItem><FormLabel>Ex-Showroom Price</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="discount" render={({ field }) => (
                              <FormItem><FormLabel>Discount (₹)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="sgst" render={({ field }) => (
                              <FormItem><FormLabel>SGST (14%)</FormLabel><FormControl><Input type="number" {...field} readOnly className="bg-gray-100 dark:bg-gray-800" /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="cgst" render={({ field }) => (
                              <FormItem><FormLabel>CGST (14%)</FormLabel><FormControl><Input type="number" {...field} readOnly className="bg-gray-100 dark:bg-gray-800" /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="onRoadPrice" render={({ field }) => (
                            <FormItem><FormLabel>On-Road Price</FormLabel><FormControl><Input type="number" {...field} readOnly className="bg-gray-100 dark:bg-gray-800" /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                    </div>
                </div>

                {/* Booking Details */}
                <div className="border p-4 rounded-md space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Booking Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="bookingDate" render={({ field }) => (
                    <FormItem className="flex flex-col pt-2"><FormLabel>Booking Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "dd/MM/yyyy") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                    </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="bookingAmount" render={({ field }) => (
                    <FormItem><FormLabel>Booking Amount</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="bookingStatus" render={({ field }) => (
                    <FormItem><FormLabel>Booking Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{["Pending", "Confirmed", "Cancelled"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <Controller
                    control={form.control}
                    name="paymentMode"
                    render={({ field }) => (
                        <FormItem className="md:col-span-3"><FormLabel>Payment Mode</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-4 pt-2">
                            {["Cash", "UPI", "Bank Transfer", "Loan"].map(mode => (
                            <FormItem key={mode} className="flex items-center space-x-2">
                                <FormControl><RadioGroupItem value={mode} id={`mode-${mode}`} /></FormControl>
                                <FormLabel htmlFor={`mode-${mode}`} className="font-normal">{mode}</FormLabel>
                            </FormItem>
                            ))}
                        </RadioGroup></FormControl><FormMessage /></FormItem>
                    )}
                    />
                </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-6">
              <Button type="button" variant="outline" onClick={() => router.back()}><X className="mr-2"/>Cancel</Button>
              <Button type="submit"><PlusCircle className="mr-2"/>Create Booking</Button>
            </CardFooter>
          </form>
        </Form>
    </Card>
  );
}
