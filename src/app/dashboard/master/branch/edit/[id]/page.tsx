
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { branchSchema } from "../../schema";
import { editBranch, getBranchById } from "../../actions";
import { BranchFormContent } from "../../branch-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Branch } from "../../columns";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditBranchPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [branch, setBranch] = useState<Branch | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const id = params.id;

    useEffect(() => {
        const fetchBranch = async () => {
            if (!id) return;
            try {
                const fetchedBranch = await getBranchById(id);
                if (fetchedBranch) {
                    setBranch(fetchedBranch as Branch);
                } else {
                    toast({ title: "Error", description: "Branch not found.", variant: "destructive" });
                    router.push('/dashboard/master/branch');
                }
            } catch (error) {
                 toast({ title: "Error", description: "Failed to fetch branch details.", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };
        fetchBranch();
    }, [id, router, toast]);

    const handleSubmit = async (values: z.infer<typeof branchSchema>) => {
        setIsSubmitting(true);
        try {
            const result = await editBranch(id, values);
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

    if (isLoading) {
        return (
             <Card className="max-w-6xl mx-auto shadow-lg">
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="max-w-6xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>Edit Branch</CardTitle>
                <CardDescription>
                    Update the details for branch: {branch?.branchName}
                </CardDescription>
            </CardHeader>
            <CardContent>
               {branch && (
                    <BranchFormContent 
                        branch={branch}
                        onSubmit={handleSubmit} 
                        isSubmitting={isSubmitting}
                        onCancel={() => router.back()}
                        submitButtonText="Save Changes"
                    />
               )}
            </CardContent>
        </Card>
    )
}
