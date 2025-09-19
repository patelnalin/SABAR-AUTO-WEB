
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { financeCompanySchema } from "../schema";
import { addFinanceCompany, getStates } from "../actions";
import { FinanceCompanyFormContent } from "../finance-company-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AddFinanceCompanyPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [states, setStates] = useState<string[]>([]);
    const [isLoadingStates, setIsLoadingStates] = useState(true);

     useEffect(() => {
        const fetchStates = async () => {
            try {
                const stateNames = await getStates();
                setStates(stateNames);
            } catch (error) {
                toast({ title: "Error", description: "Failed to load states.", variant: "destructive"});
            } finally {
                setIsLoadingStates(false);
            }
        };
        fetchStates();
    }, [toast]);


    const handleSubmit = async (values: z.infer<typeof financeCompanySchema>) => {
        setIsSubmitting(true);
        try {
            const result = await addFinanceCompany(values);
            if (result.success) {
                toast({ title: "Success", description: result.message });
                router.push("/dashboard/master/finance-company");
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
                <CardTitle>Add New Finance Company</CardTitle>
                <CardDescription>
                    Fill in the details below to add a new company record.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoadingStates ? (
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : (
                    <FinanceCompanyFormContent 
                        onSubmit={handleSubmit} 
                        isSubmitting={isSubmitting}
                        onCancel={() => router.back()}
                        submitButtonText="Add Company"
                        stateNames={states}
                    />
                )}
            </CardContent>
        </Card>
    )
}
