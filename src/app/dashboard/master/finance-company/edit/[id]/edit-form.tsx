
"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { financeCompanySchema } from "../../schema";
import { editFinanceCompany } from "../../actions";
import { FinanceCompanyFormContent } from "../../finance-company-form";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FinanceCompany } from "../../columns";
import { Skeleton } from "@/components/ui/skeleton";

export function EditFinanceCompanyForm({ company, stateNames }: { company: FinanceCompany | null, stateNames: string[] }) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!company) {
        return (
            <div>
                 <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <div className="space-y-6 p-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        )
    }

    const handleSubmit = async (values: z.infer<typeof financeCompanySchema>) => {
        setIsSubmitting(true);
        try {
            const result = await editFinanceCompany(company.id, values);
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
        <>
            <CardHeader>
                <CardTitle>Edit Finance Company</CardTitle>
                <CardDescription>
                    Update the details for company: {company?.companyName}
                </CardDescription>
            </CardHeader>
            <FinanceCompanyFormContent 
                company={company}
                onSubmit={handleSubmit} 
                isSubmitting={isSubmitting}
                onCancel={() => router.back()}
                submitButtonText="Save Changes"
                stateNames={stateNames}
            />
        </>
    )
}
