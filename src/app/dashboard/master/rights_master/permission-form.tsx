
"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Permission } from "./page";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const permissionSchema = z.object({
  branchName: z.string().min(1, "Branch is required"),
  userName: z.string().min(1, "User is required"),
  userRole: z.string().min(1, "Role is required"),
  modules: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one module.",
  }),
  permissions: z.object({
    view: z.boolean().default(false),
    create: z.boolean().default(false),
    edit: z.boolean().default(false),
    delete: z.boolean().default(false),
    approve: z.boolean().default(false),
  }),
  status: z.enum(["Active", "Inactive"]),
});

type PermissionFormValues = z.infer<typeof permissionSchema>;

const MOCK_USERS = ["Anjali Sharma", "Vikram Singh", "Ravi Mehra", "Suresh Patil", "Priya Verma"];
const MOCK_BRANCHES = ["Pune Kothrud", "Mumbai Andheri", "Pune Viman Nagar"];
const MOCK_MODULES = [
    "HR", "Employee", "Leaves", "Account", "Sales", "Enquiry", 
    "Sales Challan", "Purchase Order", "Purchase Invoice", "Insurance", 
    "Payment", "Voucher", "CRM", "CRM Dashboard", "Master", "Company",
    "Branch", "City/Village", "Vehicle Master", "Supplier", "Finance", 
    "User", "Rights Master", "Year", "Reports", "Sales Report", "Finance Report", "Year Report"
];
const permissionTypes = ["view", "create", "edit", "delete", "approve"] as const;

interface PermissionFormContentProps {
    permission?: Permission | null;
    onSubmit: (values: PermissionFormValues) => Promise<void>;
    isSubmitting: boolean;
    onCancel: () => void;
    submitButtonText?: string;
    inDialog?: boolean;
}

export function PermissionFormContent({
    permission,
    onSubmit,
    isSubmitting,
    onCancel,
    submitButtonText = "Save",
    inDialog = false
}: PermissionFormContentProps) {
  const form = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      branchName: "",
      userName: "",
      userRole: "Sales Rep",
      modules: permission?.module ? [permission.module] : [],
      permissions: { view: false, create: false, edit: false, delete: false, approve: false },
      status: "Active",
    },
  });

   useEffect(() => {
    if (permission) {
      form.reset({
          ...permission,
          modules: [permission.module]
      });
    } else {
      form.reset({
        branchName: "",
        userName: "",
        userRole: "Sales Rep",
        modules: [],
        permissions: { view: true, create: false, edit: false, delete: false, approve: false },
        status: "Active",
      });
    }
  }, [permission, form]);
  
  const FormWrapper = inDialog ? "div" : CardContent;
  const FooterWrapper = inDialog ? DialogFooter : CardFooter;
  const watchedPermissions = form.watch("permissions");

  const areAllSelected = permissionTypes.every(p => watchedPermissions[p]);

  const handleSelectAll = (checked: boolean) => {
    permissionTypes.forEach(p => {
      form.setValue(`permissions.${p}`, checked, { shouldDirty: true });
    });
  }

  return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormWrapper className={!inDialog ? "pt-6" : ""}>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <FormField control={form.control} name="branchName" render={({ field }) => (
                        <FormItem><FormLabel>Branch</FormLabel><Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a branch" /></SelectTrigger></FormControl>
                            <SelectContent>{MOCK_BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                        </Select><FormMessage /></FormItem>
                      )} />
                       <FormField control={form.control} name="userName" render={({ field }) => (
                        <FormItem><FormLabel>User</FormLabel><Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a user" /></SelectTrigger></FormControl>
                            <SelectContent>{MOCK_USERS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                        </Select><FormMessage /></FormItem>
                      )} />
                       <FormField control={form.control} name="userRole" render={({ field }) => (
                        <FormItem><FormLabel>User Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>

                    <FormField
                        control={form.control}
                        name="modules"
                        render={() => (
                            <FormItem>
                            <div className="mb-4">
                                <FormLabel className="text-base">Modules/Features</FormLabel>
                                <FormDescription>
                                Select the modules this permission set will apply to.
                                </FormDescription>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 rounded-lg border p-4">
                                {MOCK_MODULES.map((item) => (
                                <FormField
                                    key={item}
                                    control={form.control}
                                    name="modules"
                                    render={({ field }) => {
                                    return (
                                        <FormItem
                                        key={item}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                        <FormControl>
                                            <Checkbox
                                            checked={field.value?.includes(item)}
                                            onCheckedChange={(checked) => {
                                                return checked
                                                ? field.onChange([...(field.value || []), item])
                                                : field.onChange(
                                                    field.value?.filter(
                                                        (value) => value !== item
                                                    )
                                                    )
                                            }}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            {item}
                                        </FormLabel>
                                        </FormItem>
                                    )
                                    }}
                                />
                                ))}
                            </div>
                            <FormMessage />
                            </FormItem>
                        )}
                        />


                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <FormLabel>Permission Types</FormLabel>
                             <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="select-all"
                                    checked={areAllSelected}
                                    onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                                />
                                <label htmlFor="select-all" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Select All
                                </label>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 rounded-lg border p-4">
                            {permissionTypes.map(type => (
                                 <FormField
                                    key={type}
                                    control={form.control}
                                    name={`permissions.${type}`}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                             <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                             </FormControl>
                                             <FormLabel className="font-normal capitalize">{type}</FormLabel>
                                        </FormItem>
                                    )}
                                 />
                            ))}
                        </div>
                    </div>

                    <FormField control={form.control} name="status" render={({ field }) => (
                        <FormItem><FormLabel>Status</FormLabel><FormControl>
                            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center">
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Active" /></FormControl><FormLabel className="font-normal">Active</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Inactive" /></FormControl><FormLabel className="font-normal">Inactive</FormLabel></FormItem>
                            </RadioGroup>
                        </FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </FormWrapper>

            <FooterWrapper className={!inDialog ? "flex justify-end gap-2" : ""}>
              <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {submitButtonText}
              </Button>
            </FooterWrapper>
          </form>
        </Form>
  );
}


interface PermissionFormDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  permission: Permission | null;
  onSave: (data: Omit<Permission, 'id' | 'module'> & {modules: string[]}) => void;
}

export function PermissionFormDialog({ isOpen, setIsOpen, permission, onSave }: PermissionFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: PermissionFormValues) => {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async
      onSave(values);
      setIsSubmitting(false);
      setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{permission ? "Edit Permission" : "Add New Permission"}</DialogTitle>
          <DialogDescription>
            Fill in the details to manage user access rights.
          </DialogDescription>
        </DialogHeader>
        <PermissionFormContent 
            permission={permission}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => setIsOpen(false)}
            submitButtonText="Save Changes"
            inDialog
        />
      </DialogContent>
    </Dialog>
  );
}
