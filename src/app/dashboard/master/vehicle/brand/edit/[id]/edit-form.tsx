
"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { brandSchema } from "../../schema";
import { editBrand } from "../../actions";
import { BrandFormContent } from "../../brand-form";
import { Brand } from "../../columns";
import { Skeleton } from "@/components/ui/skeleton";

export function EditBrandForm({ brand }: { brand: Brand | null }) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!brand) {
        return (
             <div className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        )
    }

    const handleSubmit = async (values: z.infer<typeof brandSchema>) => {
        setIsSubmitting(true);
        try {
            const result = await editBrand(brand.id, values);
            if (result.success) {
                toast({ title: "Success", description: result.message });
                router.push("/dashboard/master/vehicle/brand");
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
        <BrandFormContent 
            brand={brand}
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting}
            onCancel={() => router.back()}
            submitButtonText="Save Changes"
        />
    )
}
