
"use client";

import { useRouter } from "next/navigation";
import { BranchFormContent } from "../branch-form";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { addBranch } from "../actions";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { branchSchema } from "../schema";
import { useState } from "react";

export default function AddBranchPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values: z.infer<typeof branchSchema>) => {
        setIsSubmitting(true);
        try {
            const result = await addBranch(values);
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
        <Card className="max-w-6xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>Add New Branch</CardTitle>
                <CardDescription>
                    Fill in the details below to add a new branch.
                </CardDescription>
            </CardHeader>
            <BranchFormContent 
                onSubmit={handleSubmit} 
                isSubmitting={isSubmitting}
                onCancel={() => router.back()}
                submitButtonText="Add Branch"
            />
        </Card>
    )
}
