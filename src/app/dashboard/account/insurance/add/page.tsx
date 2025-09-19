
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { insuranceSchema } from "../schema";
import { InsuranceFormContent } from "../insurance-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function AddInsurancePage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values: z.infer<typeof insuranceSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/account/insurance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            const result = await response.json();

            if (response.ok) {
                toast({ title: "Success", description: "Insurance policy added successfully." });
                router.push("/dashboard/account/insurance");
                router.refresh();
            } else {
                toast({
                    title: "Error",
                    description: result.message || "An error occurred.",
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
        <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>Add New Insurance Policy</CardTitle>
                <CardDescription>
                    Fill in the details below to add a new policy.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <InsuranceFormContent 
                    onSubmit={handleSubmit} 
                    isSubmitting={isSubmitting}
                    onCancel={() => router.back()}
                    submitButtonText="Add Policy"
                />
            </CardContent>
        </Card>
    )
}
