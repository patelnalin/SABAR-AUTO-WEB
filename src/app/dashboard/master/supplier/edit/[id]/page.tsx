
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { supplierSchema } from "../../schema";
import { editSupplier, getSupplierById } from "../../actions";
import { SupplierFormContent } from "../../supplier-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Supplier } from "../../columns";
import { Skeleton } from "@/components/ui/skeleton";


export async function generateStaticParams() {
    return [];
}

export default function EditSupplierPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const id = params.id;

    useEffect(() => {
        const fetchSupplier = async () => {
            if (!id) return;
            try {
                const fetchedSupplier = await getSupplierById(id);
                if (fetchedSupplier) {
                    setSupplier(fetchedSupplier as Supplier);
                } else {
                    toast({ title: "Error", description: "Supplier not found.", variant: "destructive" });
                    router.push('/dashboard/master/supplier');
                }
            } catch (error) {
                 toast({ title: "Error", description: "Failed to fetch supplier details.", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };
        fetchSupplier();
    }, [id, router, toast]);

    const handleSubmit = async (values: z.infer<typeof supplierSchema>) => {
        setIsSubmitting(true);
        try {
            const result = await editSupplier(id, values);
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
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>Edit Supplier</CardTitle>
                <CardDescription>
                    Update the details for supplier: {supplier?.supplierName}
                </CardDescription>
            </CardHeader>
            <CardContent>
               {supplier && (
                    <SupplierFormContent 
                        supplier={supplier}
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
