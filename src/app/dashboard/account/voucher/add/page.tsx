
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { voucherSchema } from "../schema";
import { addVoucher } from "../actions";
import { VoucherFormContent } from "../voucher-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function AddVoucherPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values: z.infer<typeof voucherSchema>) => {
        setIsSubmitting(true);
        try {
            const result = await addVoucher(values);
            if (result.success) {
                toast({ title: "Success", description: result.message });
                router.push("/dashboard/account/voucher");
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
                <CardTitle>Create New Voucher</CardTitle>
                <CardDescription>
                    Fill in the details below to create a new financial voucher.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <VoucherFormContent 
                    onSubmit={handleSubmit} 
                    isSubmitting={isSubmitting}
                    onCancel={() => router.back()}
                    submitButtonText="Create Voucher"
                />
            </CardContent>
        </Card>
    )
}
