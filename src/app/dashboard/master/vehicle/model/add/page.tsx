
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { modelSchema } from "../schema";
import { addModel, getVehicleBrandNames } from "../actions";
import { ModelFormContent } from "../model-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AddModelPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [brandNames, setBrandNames] = useState<string[]>([]);
    const [isLoadingBrands, setIsLoadingBrands] = useState(true);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const names = await getVehicleBrandNames();
                setBrandNames(names);
            } catch (error) {
                toast({ title: "Error", description: "Failed to load vehicle brands.", variant: "destructive"});
            } finally {
                setIsLoadingBrands(false);
            }
        };
        fetchBrands();
    }, [toast]);

    const handleSubmit = async (values: z.infer<typeof modelSchema>) => {
        setIsSubmitting(true);
        try {
            const result = await addModel(values);
            if (result.success) {
                toast({ title: "Success", description: result.message });
                router.push("/dashboard/master/vehicle/model");
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
                <CardTitle>Add New Vehicle Model</CardTitle>
                <CardDescription>
                    Fill in the details below to add a new model.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoadingBrands ? (
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : (
                    <ModelFormContent 
                        onSubmit={handleSubmit} 
                        isSubmitting={isSubmitting}
                        onCancel={() => router.back()}
                        submitButtonText="Add Model"
                        brandNames={brandNames}
                    />
                )}
            </CardContent>
        </Card>
    )
}
