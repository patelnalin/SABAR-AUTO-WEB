
import * as React from "react";
import { getSupplierById, getSuppliers } from "../../actions";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Supplier } from "../../columns";
import { EditSupplierForm } from "./edit-form";

export async function generateStaticParams() {
    const suppliers = await getSuppliers();
    return suppliers.map((supplier) => ({
        id: supplier.id,
    }));
}

export default async function EditSupplierPage({ params }: { params: { id: string } }) {
    const id = params.id;
    const supplier = await getSupplierById(id) as Supplier | null;

    return (
        <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>Edit Supplier</CardTitle>
                <CardDescription>
                    Update the details for supplier: {supplier?.supplierName}
                </CardDescription>
            </CardHeader>
            <CardContent>
               <EditSupplierForm supplier={supplier} />
            </CardContent>
        </Card>
    )
}
