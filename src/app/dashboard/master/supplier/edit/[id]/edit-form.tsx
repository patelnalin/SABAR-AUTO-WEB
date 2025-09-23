
"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { supplierSchema } from "../../schema";
import { editSupplier } from "../../actions";
import { SupplierFormContent } from "../../supplier-form";
import { Supplier } from "../../columns";
import { Skeleton } from "@/components/ui/skeleton";

export function EditSupplierForm({ supplier }: { supplier: Supplier | null }) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!supplier) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        )
    }

    const handleSubmit = async (values: z.infer<typeof supplierSchema>) => {
        setIsSubmitting(true);
        try {
            const result = await editSupplier(supplier.id, values);
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
        <SupplierFormContent 
            supplier={supplier}
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting}
            onCancel={() => router.back()}
            submitButtonText="Save Changes"
        />
    );
}
