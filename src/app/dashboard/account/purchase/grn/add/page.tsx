
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { GrnForm } from "../grn-form";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { grnSchema } from "../schema";


export default function AddGrnPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values: z.infer<typeof grnSchema>) => {
        setIsSubmitting(true);
        try {
            console.log("New GRN Data:", values);
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast({ title: "Success", description: "GRN created successfully." });
            router.push("/dashboard/account/purchase/grn");
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
        <GrnForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
        />
    );
}
