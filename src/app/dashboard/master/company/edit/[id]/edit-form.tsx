
"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { companySchema } from "../../schema";
import { editCompany } from "../../actions";
import { CompanyFormContent } from "../../company-form";
import { Company } from "../../columns";
import { Skeleton } from "@/components/ui/skeleton";
import { CardContent } from "@/components/ui/card";

export function EditCompanyForm({ company }: { company: Company | null }) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!company) {
         return (
             <CardContent>
                <div className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
        )
    }

    const handleSubmit = async (values: z.infer<typeof companySchema>) => {
        setIsSubmitting(true);
        try {
            const result = await editCompany(company.id, values);
            if (result.success) {
                toast({ title: "Success", description: result.message });
                router.push("/dashboard/master/company");
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
        <CompanyFormContent 
            company={company}
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting}
            onCancel={() => router.back()}
            submitButtonText="Save Changes"
        />
    );
}
