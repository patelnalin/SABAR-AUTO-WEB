
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { PermissionFormContent } from "../permission-form";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// Re-defining the schema here as we don't have a central schema file for permissions yet.
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


export default function AssignPermissionPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values: z.infer<typeof permissionSchema>) => {
        setIsSubmitting(true);
        // Simulate API call
        console.log("New Permission Data:", values);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast({ title: "Success", description: "New permission created successfully." });
        router.push("/dashboard/master/rights_master");
        setIsSubmitting(false);
    };

    return (
        <Card className="max-w-7xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>Assign New Permission</CardTitle>
                <CardDescription>
                    Fill in the details below to assign a new user permission.
                </CardDescription>
            </CardHeader>
            <PermissionFormContent 
                onSubmit={handleSubmit} 
                isSubmitting={isSubmitting}
                onCancel={() => router.back()}
                submitButtonText="Assign Permission"
            />
        </Card>
    )
}
