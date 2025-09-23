
"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { insuranceCompanySchema } from "../../schema";
import { editInsuranceCompany } from "../../actions";
import { InsuranceCompanyFormContent } from "../../insurance-company-form";
import { InsuranceCompany } from "../../columns";
import { Skeleton } from "@/components/ui/skeleton";

export function EditInsuranceCompanyForm({ company, stateNames }: { company: InsuranceCompany | null, stateNames: string[] }) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!company) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        )
    }

    const handleSubmit = async (values: z.infer<typeof insuranceCompanySchema>) => {
        setIsSubmitting(true);
        try {
            const result = await editInsuranceCompany(company.id, values);
            if (result.success) {
                toast({ title: "Success", description: result.message });
                router.push("/dashboard/master/insurance-company");
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
        <InsuranceCompanyFormContent 
            company={company}
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting}
            onCancel={() => router.back()}
            submitButtonText="Save Changes"
            stateNames={stateNames}
        />
    )
}
