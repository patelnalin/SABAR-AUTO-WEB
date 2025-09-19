
"use client";

import { useRouter } from "next/navigation";
import { CompanyFormContent } from "../company-form";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { addCompany } from "../actions";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { companySchema } from "../schema";
import { useState } from "react";
import { Loader2 } from "lucide-react";


export default function AddCompanyPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values: z.infer<typeof companySchema>) => {
        setIsSubmitting(true);
        try {
            const result = await addCompany(values);
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
        <Card className="max-w-6xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>Add New Company</CardTitle>
                <CardDescription>
                    Fill in the details below to add a new company profile.
                </CardDescription>
            </CardHeader>
            <CompanyFormContent 
                onSubmit={handleSubmit} 
                isSubmitting={isSubmitting}
                onCancel={() => router.back()}
                submitButtonText="Add Company"
            />
        </Card>
    )
}
