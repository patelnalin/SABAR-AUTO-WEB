
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { companySchema } from "./schema";
import { editCompany } from "./actions";
import { Company } from "./columns";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { CardContent, CardFooter } from "@/components/ui/card";

// Reusable Form Content Component
export function CompanyFormContent({ 
  company, 
  onSubmit, 
  isSubmitting, 
  onCancel,
  submitButtonText = "Save Changes",
  inDialog = false 
}: { 
  company?: Company, 
  onSubmit: (values: z.infer<typeof companySchema>) => Promise<void>,
  isSubmitting: boolean,
  onCancel: () => void,
  submitButtonText?: string,
  inDialog?: boolean
}) {
  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: company || {
      companyName: "",
      registrationNumber: "",
      gstNumber: "",
      industryType: "IT",
      address: "",
      city: "",
      state: "",
      country: "India",
      pincode: "",
      email: "",
      phone: "",
      website: "",
    },
  });

  const FormWrapper = inDialog ? React.Fragment : CardContent;
  const FooterWrapper = inDialog ? DialogFooter : CardFooter;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormWrapper>
          <div className="space-y-8">
            {/* Company Identity */}
            <div className="border p-4 rounded-md space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Company Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-3">
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Innovate Inc." {...field} className="h-8" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration No.</FormLabel>
                      <FormControl>
                        <Input placeholder="U74999DL2015PTC288636" {...field} className="h-8" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gstNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GST No.</FormLabel>
                      <FormControl>
                        <Input placeholder="27ABCDE1234F1Z5" {...field} className="h-8" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industryType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["IT", "Manufacturing", "Finance", "Healthcare", "Other"].map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="border p-4 rounded-md space-y-4">
               <h3 className="text-lg font-semibold border-b pb-2">Contact Information</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@company.com" {...field} className="h-8" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="9876543210" {...field} className="h-8" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://company.com" {...field} className="h-8" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Address */}
            <div className="border p-4 rounded-md space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-4">
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="123 Main Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Mumbai" {...field} className="h-8" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="Maharashtra" {...field} className="h-8" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input placeholder="400001" {...field} className="h-8" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="India" {...field} className="h-8" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </FormWrapper>
        <FooterWrapper className={!inDialog ? "flex justify-end gap-2" : ""}>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitButtonText}
          </Button>
        </FooterWrapper>
      </form>
    </Form>
  )
}

// Dialog Wrapper for Edit
type CompanyFormProps = {
  company: Company;
  trigger: React.ReactNode;
};

export function CompanyForm({ company, trigger }: CompanyFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof companySchema>) => {
    setIsSubmitting(true);
    try {
      const result = await editCompany(company.id, values);

      if (result.success) {
        toast({ title: "Success", description: result.message });
        setIsOpen(false);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
          <DialogDescription>
            Update the details for the company profile.
          </DialogDescription>
        </DialogHeader>
        <CompanyFormContent 
            company={company}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => setIsOpen(false)}
            submitButtonText="Save Changes"
            inDialog={true}
        />
      </DialogContent>
    </Dialog>
  );
}
