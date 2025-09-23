
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { brandSchema } from "../../schema";
import { editBrand, getBrandById } from "../../actions";
import { BrandFormContent } from "../../brand-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Brand } from "../../columns";
import { Skeleton } from "@/components/ui/skeleton";


export async function generateStaticParams() {
    return [];
}


export default function EditBrandPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [brand, setBrand] = useState<Brand | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const id = params.id;

    useEffect(() => {
        const fetchBrand = async () => {
            if (!id) return;
            try {
                const fetchedBrand = await getBrandById(id);
                if (fetchedBrand) {
                    setBrand(fetchedBrand as Brand);
                } else {
                    toast({ title: "Error", description: "Brand not found.", variant: "destructive" });
                    router.push('/dashboard/master/vehicle/brand');
                }
            } catch (error) {
                 toast({ title: "Error", description: "Failed to fetch brand details.", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };
        fetchBrand();
    }, [id, router, toast]);

    const handleSubmit = async (values: z.infer<typeof brandSchema>) => {
        setIsSubmitting(true);
        try {
            const result = await editBrand(id, values);
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

    if (isLoading) {
        return (
             <Card className="max-w-4xl mx-auto shadow-lg">
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>Edit Vehicle Brand</CardTitle>
                <CardDescription>
                    Update the details for brand: {brand?.brandName}
                </CardDescription>
            </CardHeader>
            <CardContent>
               {brand && (
                    <BrandFormContent 
                        brand={brand}
                        onSubmit={handleSubmit} 
                        isSubmitting={isSubmitting}
                        onCancel={() => router.back()}
                        submitButtonText="Save Changes"
                    />
               )}
            </CardContent>
        </Card>
    )
}
