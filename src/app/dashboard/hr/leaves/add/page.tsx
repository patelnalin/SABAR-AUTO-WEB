
"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, PlusCircle, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const leaveFormSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  employeeName: z.string().min(2, "Employee name is required"),
  department: z.enum(["HR", "Sales", "IT", "Accounts"]),
  leaveType: z.enum(["Casual Leave", "Sick Leave", "Paid Leave", "Maternity Leave", "Unpaid Leave"]),
  fromDate: z.date({ required_error: "From date is required" }),
  toDate: z.date({ required_error: "To date is required" }),
  reason: z.string().min(10, "Reason must be at least 10 characters.").max(200, "Reason must not exceed 200 characters."),
}).refine(data => data.toDate >= data.fromDate, {
  message: "To date cannot be before From date",
  path: ["toDate"],
});

type LeaveApplication = z.infer<typeof leaveFormSchema>;

export default function AddLeavePage() {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<LeaveApplication>({
        resolver: zodResolver(leaveFormSchema),
        defaultValues: {
            employeeId: "",
            employeeName: "",
            department: "IT",
            leaveType: "Casual Leave",
            reason: "",
        },
    });

    const onSubmit = (values: LeaveApplication) => {
        // In a real app, you would save this data.
        // For this example, we'll just show a success message and redirect.
        console.log("New Leave Application:", values);
        toast({ title: "Success", description: "Leave application submitted successfully." });
        router.push("/dashboard/hr/leaves");
    };

    return (
        <Card className="shadow-lg max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Apply for Leave</CardTitle>
                <CardDescription>Fill out the form below to submit a new leave application.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        <div>
                             <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Employee & Leave Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <FormField control={form.control} name="employeeId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Employee ID</FormLabel>
                                        <FormControl><Input placeholder="EMP001" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="employeeName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Employee Name</FormLabel>
                                        <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="department" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Department</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {["HR", "Sales", "IT", "Accounts"].map(dept => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="leaveType" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Leave Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select leave type" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {["Casual Leave", "Sick Leave", "Paid Leave", "Maternity Leave", "Unpaid Leave"].map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="fromDate" render={({ field }) => (
                                    <FormItem className="flex flex-col pt-2">
                                        <FormLabel>From Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                        {field.value ? format(field.value, "dd/MM/yyyy") : <span>Pick a date</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="toDate" render={({ field }) => (
                                    <FormItem className="flex flex-col pt-2">
                                        <FormLabel>To Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                        {field.value ? format(field.value, "dd/MM/yyyy") : <span>Pick a date</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                
                            </div>
                        </div>
                        <div>
                             <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Reason for Absence</h3>
                             <FormField control={form.control} name="reason" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reason</FormLabel>
                                    <FormControl><Textarea placeholder="Describe the reason for your leave..." {...field} rows={4} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => router.back()}><XCircle className="mr-2" /> Cancel</Button>
                        <Button type="submit"><PlusCircle className="mr-2"/> Apply Leave</Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
