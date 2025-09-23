
"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { branchSchema } from "../../schema";
import { editBranch } from "../../actions";
import { BranchFormContent } from "../../branch-form";
import { Branch } from "../../columns";
import { Skeleton } from "@/components/ui/skeleton";

export function EditBranchForm({ branch }: { branch: Branch | null }) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!branch) {
         return (
             <div className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        )
    }

    const handleSubmit = async (values: z.infer<typeof branchSchema>) => {
        setIsSubmitting(true);
        try {
            const result = await editBranch(branch.id, values);
            if (result.success) {
                toast({ title: "Success", description: result.message });
                router.push("/dashboard/master/branch");
                router.refresh();
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
        <BranchFormContent 
            branch={branch}
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting}
            onCancel={() => router.back()}
            submitButtonText="Save Changes"
        />
    );
}
