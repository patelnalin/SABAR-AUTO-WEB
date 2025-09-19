
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { brandSchema } from "../schema";
import { addBrand } from "../actions";
import { BrandFormContent } from "../brand-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function AddBrandPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values: z.infer<typeof brandSchema>) => {
        setIsSubmitting(true);
        try {
            const result = await addBrand(values);
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
        <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>Add New Vehicle Brand</CardTitle>
                <CardDescription>
                    Fill in the details below to add a new brand.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <BrandFormContent 
                    onSubmit={handleSubmit} 
                    isSubmitting={isSubmitting}
                    onCancel={() => router.back()}
                    submitButtonText="Add Brand"
                />
            </CardContent>
        </Card>
    )
}
