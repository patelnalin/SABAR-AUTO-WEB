
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { supplierSchema } from "../schema";
import { addSupplier } from "../actions";
import { SupplierFormContent } from "../supplier-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function AddSupplierPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values: z.infer<typeof supplierSchema>) => {
        setIsSubmitting(true);
        try {
            const result = await addSupplier(values);
            if (result.success) {
                toast({ title: "Success", description: result.message });
                router.push("/dashboard/master/supplier");
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
        <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>Add New Supplier</CardTitle>
                <CardDescription>
                    Fill in the details below to add a new supplier.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SupplierFormContent 
                    onSubmit={handleSubmit} 
                    isSubmitting={isSubmitting}
                    onCancel={() => router.back()}
                    submitButtonText="Add Supplier"
                />
            </CardContent>
        </Card>
    )
}
