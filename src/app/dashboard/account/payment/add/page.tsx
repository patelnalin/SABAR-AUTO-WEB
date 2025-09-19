
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { paymentSchema } from "../schema";
import { addPayment } from "../actions";
import { PaymentFormContent } from "../payment-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function AddPaymentPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values: z.infer<typeof paymentSchema>) => {
        setIsSubmitting(true);
        try {
            const result = await addPayment(values);
            if (result.success) {
                toast({ title: "Success", description: result.message });
                router.push("/dashboard/account/payment");
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
                <CardTitle>Record New Payment</CardTitle>
                <CardDescription>
                    Fill in the details below to record a new payment.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <PaymentFormContent 
                    onSubmit={handleSubmit} 
                    isSubmitting={isSubmitting}
                    onCancel={() => router.back()}
                    submitButtonText="Record Payment"
                />
            </CardContent>
        </Card>
    )
}
