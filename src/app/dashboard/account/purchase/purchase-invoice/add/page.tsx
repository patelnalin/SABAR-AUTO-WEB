
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { InvoiceForm } from "../invoice-form";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { invoiceSchema } from "../schema";


export default function AddPurchaseInvoicePage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values: z.infer<typeof invoiceSchema>) => {
        setIsSubmitting(true);
        try {
            // In a real app, you would call your API/server action here.
            console.log("New Purchase Invoice Data:", values);
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast({ title: "Success", description: "Purchase Invoice created successfully." });
            router.push("/dashboard/account/purchase/purchase-invoice");
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
        <Card className="max-w-7xl mx-auto shadow-lg">
            <CardContent className="pt-6">
                <InvoiceForm
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            </CardContent>
        </Card>
    );
}
