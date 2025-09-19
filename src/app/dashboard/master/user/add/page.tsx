
"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

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
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { getBranches } from "../../branch/actions";
import { Skeleton } from "@/components/ui/skeleton";

const userSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  role: z.enum(["Admin", "User", "Manager"]),
  department: z.enum(["HR", "Sales", "IT", "Accounts", "Marketing"]),
  branch: z.string().min(1, "Branch is required."),
  status: z.boolean().default(true),
});

type Branch = {
  id: string;
  branchName: string;
}

export default function AddUserPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBranches() {
      try {
        const fetchedBranches = await getBranches();
        setBranches(fetchedBranches);
      } catch (error) {
        toast({ title: "Error", description: "Could not fetch branches", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchBranches();
  }, [toast]);

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      role: "User",
      department: "Sales",
      branch: "",
      status: true,
    },
  });

  const onSubmit = (values: z.infer<typeof userSchema>) => {
    console.log("New User Data:", values);
    toast({ title: "Success", description: "User created successfully." });
    router.push("/dashboard/master/user");
  };
  
  if (isLoading) {
      return (
        <Card className="shadow-lg max-w-4xl mx-auto">
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
             <CardFooter className="flex justify-end gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
            </CardFooter>
        </Card>
      )
  }

  return (
    <Card className="shadow-lg max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Add New User</CardTitle>
        <CardDescription>Fill in the form below to create a new user account.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="fullName" render={({ field }) => (
                  <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="user@example.com" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                  <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="9876543210" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
               <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="******" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="role" render={({ field }) => (
                  <FormItem><FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>{["Admin", "User", "Manager"].map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}</SelectContent>
                      </Select><FormMessage />
                  </FormItem>
              )} />
               <FormField control={form.control} name="department" render={({ field }) => (
                  <FormItem><FormLabel>Department</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>{["HR", "Sales", "IT", "Accounts", "Marketing"].map(dep => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}</SelectContent>
                      </Select><FormMessage />
                  </FormItem>
              )} />
               <FormField control={form.control} name="branch" render={({ field }) => (
                  <FormItem><FormLabel>Branch</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select a branch"/></SelectTrigger></FormControl>
                          <SelectContent>{branches.map(branch => <SelectItem key={branch.id} value={branch.branchName}>{branch.branchName}</SelectItem>)}</SelectContent>
                      </Select><FormMessage />
                  </FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                    <FormLabel>Status</FormLabel>
                    <div className="flex items-center space-x-2 pt-2">
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} id="status-switch" /></FormControl>
                        <label htmlFor="status-switch" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                           {field.value ? 'Active' : 'Inactive'}
                        </label>
                    </div>
                    <FormMessage />
                </FormItem>
              )} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}><XCircle className="mr-2" /> Cancel</Button>
            <Button type="submit"><PlusCircle className="mr-2" /> Create User</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
