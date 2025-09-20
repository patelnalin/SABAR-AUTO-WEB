
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { BillForm } from "../bill-form";
import { billSchema } from "../schema";
import { addBill } from "../actions";

export default function AddMeetarBillPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values: z.infer<typeof billSchema>) => {
        setIsSubmitting(true);
        try {
            const result = await addBill(values);
            if (result.success) {
                toast({ title: "Success", description: result.message });
                router.push("/dashboard/account/sales/meetarbill");
            } else {
                 toast({ title: "Error", description: result.message, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BillForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
        />
    );
}
