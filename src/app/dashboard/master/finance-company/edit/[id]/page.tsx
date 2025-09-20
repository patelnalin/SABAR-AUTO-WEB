
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { financeCompanySchema } from "../../schema";
import { editFinanceCompany, getFinanceCompanyById, getStates } from "../../actions";
import { FinanceCompanyFormContent } from "../../finance-company-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { FinanceCompany } from "../../columns";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditFinanceCompanyPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [company, setCompany] = useState<FinanceCompany | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [states, setStates] = useState<string[]>([]);
    const id = params.id;

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                 const [fetchedCompany, stateNames] = await Promise.all([
                    getFinanceCompanyById(id),
                    getStates()
                ]);

                if (fetchedCompany) {
                    setCompany(fetchedCompany as FinanceCompany);
                } else {
                    toast({ title: "Error", description: "Company not found.", variant: "destructive" });
                    router.push('/dashboard/master/finance-company');
                }
                setStates(stateNames);
            } catch (error) {
                 toast({ title: "Error", description: "Failed to fetch company details.", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id, router, toast]);

    const handleSubmit = async (values: z.infer<typeof financeCompanySchema>) => {
        setIsSubmitting(true);
        try {
            const result = await editFinanceCompany(id, values);
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
                <CardTitle>Edit Finance Company</CardTitle>
                <CardDescription>
                    Update the details for company: {company?.companyName}
                </CardDescription>
            </CardHeader>
            <CardContent>
               {company && (
                    <FinanceCompanyFormContent 
                        company={company}
                        onSubmit={handleSubmit} 
                        isSubmitting={isSubmitting}
                        onCancel={() => router.back()}
                        submitButtonText="Save Changes"
                        stateNames={states}
                    />
               )}
            </CardContent>
        </Card>
    )
}
