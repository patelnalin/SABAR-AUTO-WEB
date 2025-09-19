
"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, PlusCircle, XCircle } from "lucide-react";

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
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().min(2, "Last name is required."),
  email: z.string().email("Invalid email address."),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits."),
  dateOfBirth: z.date({ required_error: "Date of birth is required." }),
  gender: z.enum(["Male", "Female", "Other"]),
  address: z.object({
      street: z.string().min(1, "Street is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      zip: z.string().min(5, "Zip code is required"),
      country: z.string().min(1, "Country is required"),
  }),
  department: z.enum(["HR", "Sales", "IT", "Accounts", "Marketing"]),
  jobTitle: z.string().min(2, "Job title is required."),
  employeeType: z.enum(["Full-Time", "Part-Time", "Contract", "Intern"]),
  joiningDate: z.date({ required_error: "Joining date is required." }),
  salary: z.coerce.number().min(0, "Salary must be a positive number."),
  reportingManager: z.string().optional(),
  employmentStatus: z.enum(["Active", "On Leave", "Resigned", "Terminated"]),
  workLocation: z.string().min(2, "Work location is required."),
});

type Employee = z.infer<typeof formSchema>;

export default function AddEmployeePage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<Employee>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: undefined,
      gender: "Male",
      address: { street: "", city: "", state: "", zip: "", country: "India" },
      department: "IT",
      jobTitle: "",
      employeeType: "Full-Time",
      joiningDate: undefined,
      salary: 0,
      reportingManager: "",
      employmentStatus: "Active",
      workLocation: "",
    },
  });

  const onSubmit = (values: Employee) => {
    console.log("New Employee Data:", values);
    toast({ title: "Success", description: "Employee added successfully." });
    router.push("/dashboard/hr/employee");
  };

  return (
    <Card className="shadow-lg max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Employee</CardTitle>
        <CardDescription>Fill in the details below to create a new employee record.</CardDescription>
      </CardHeader>
      <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
                <div className="space-y-8">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <FormField control={form.control} name="employeeId" render={({ field }) => (
                          <FormItem><FormLabel>Employee ID</FormLabel><FormControl><Input placeholder="EMP001" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="firstName" render={({ field }) => (
                          <FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="lastName" render={({ field }) => (
                          <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                          <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="phone" render={({ field }) => (
                          <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="9876543210" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                          <FormItem className="flex flex-col pt-2"><FormLabel>Date of Birth</FormLabel>
                              <Popover><PopoverTrigger asChild><FormControl>
                                  <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                      {field.value ? format(field.value, "dd/MM/yyyy") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button></FormControl></PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} captionLayout="dropdown-buttons" fromYear={1950} toYear={new Date().getFullYear()} initialFocus /></PopoverContent>
                              </Popover><FormMessage />
                          </FormItem>
                      )} />
                       <FormField control={form.control} name="gender" render={({ field }) => (
                          <FormItem><FormLabel>Gender</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                  <SelectContent>{["Male", "Female", "Other"].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                              </Select><FormMessage />
                          </FormItem>
                      )} />
                    </div>
                  </div>

                  {/* Address Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <FormField control={form.control} name="address.street" render={({ field }) => (
                          <FormItem className="lg:col-span-4"><FormLabel>Street Address</FormLabel><FormControl><Textarea placeholder="123 Main St" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="address.city" render={({ field }) => (
                          <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Mumbai" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                       <FormField control={form.control} name="address.state" render={({ field }) => (
                          <FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="Maharashtra" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="address.zip" render={({ field }) => (
                          <FormItem><FormLabel>Zip Code</FormLabel><FormControl><Input placeholder="400001" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="address.country" render={({ field }) => (
                          <FormItem><FormLabel>Country</FormLabel><FormControl><Input placeholder="India" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  </div>


                  {/* Employment Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Employment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <FormField control={form.control} name="department" render={({ field }) => (
                          <FormItem><FormLabel>Department</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                  <SelectContent>{["HR", "Sales", "IT", "Accounts", "Marketing"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                              </Select><FormMessage />
                          </FormItem>
                      )} />
                      <FormField control={form.control} name="jobTitle" render={({ field }) => (
                          <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input placeholder="Software Engineer" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                       <FormField control={form.control} name="employeeType" render={({ field }) => (
                          <FormItem><FormLabel>Employee Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                  <SelectContent>{["Full-Time", "Part-Time", "Contract", "Intern"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                              </Select><FormMessage />
                          </FormItem>
                      )} />
                      <FormField control={form.control} name="joiningDate" render={({ field }) => (
                          <FormItem className="flex flex-col pt-2"><FormLabel>Joining Date</FormLabel>
                              <Popover><PopoverTrigger asChild><FormControl>
                                  <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                      {field.value ? format(field.value, "dd/MM/yyyy") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button></FormControl></PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                              </Popover><FormMessage />
                          </FormItem>
                      )} />
                      <FormField control={form.control} name="salary" render={({ field }) => (
                          <FormItem><FormLabel>Salary (₹)</FormLabel><FormControl><Input type="number" placeholder="60000" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="reportingManager" render={({ field }) => (
                          <FormItem><FormLabel>Reporting Manager</FormLabel><FormControl><Input placeholder="Manager's Name" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="employmentStatus" render={({ field }) => (
                          <FormItem><FormLabel>Employment Status</FormLabel>
                               <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                  <SelectContent>{["Active", "On Leave", "Resigned", "Terminated"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                              </Select><FormMessage />
                          </FormItem>
                      )} />
                      <FormField control={form.control} name="workLocation" render={({ field }) => (
                          <FormItem><FormLabel>Work Location</FormLabel><FormControl><Input placeholder="Office/Branch Name" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => router.back()}><XCircle className="mr-2" /> Cancel</Button>
                  <Button type="submit"><PlusCircle className="mr-2" /> Add Employee</Button>
              </CardFooter>
          </form>
      </Form>
    </Card>
  );
}
