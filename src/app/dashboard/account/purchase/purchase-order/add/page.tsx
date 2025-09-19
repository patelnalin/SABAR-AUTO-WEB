
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { PurchaseOrderForm } from "../po-form";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { poSchema } from "../schema";
import { getSuppliers } from "@/app/dashboard/master/supplier/actions";
import { Supplier } from "@/app/dashboard/master/supplier/columns";
import { getBranches } from "@/app/dashboard/master/branch/actions";
import { Branch } from "@/app/dashboard/master/branch/columns";


export default function AddPurchaseOrderPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);

    useEffect(() => {
        getSuppliers().then(setSuppliers);
        getBranches().then(setBranches);
    }, []);

    const handleSubmit = async (values: z.infer<typeof poSchema>) => {
        setIsSubmitting(true);
        try {
            // In a real app, you would call your API/server action here.
            console.log("New Purchase Order Data:", values);
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast({ title: "Success", description: "Purchase Order created successfully." });
            router.push("/dashboard/account/purchase/purchase-order");
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
                <PurchaseOrderForm
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    suppliers={suppliers}
                    branches={branches}
                />
            </CardContent>
        </Card>
    );
}
