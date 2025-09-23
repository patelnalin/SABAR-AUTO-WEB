
import * as React from "react";
import { getBrandById, getBrands } from "../../actions";
import { BrandFormContent } from "../../brand-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Brand } from "../../columns";
import { EditBrandForm } from "./edit-form";

export async function generateStaticParams() {
    const brands = await getBrands();
    return brands.map((brand) => ({
        id: brand.id,
    }));
}

export default async function EditBrandPage({ params }: { params: { id: string } }) {
    const id = params.id;
    const brand = await getBrandById(id) as Brand | null;

    return (
        <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>Edit Vehicle Brand</CardTitle>
                <CardDescription>
                    Update the details for brand: {brand?.brandName}
                </CardDescription>
            </CardHeader>
            <CardContent>
               <EditBrandForm brand={brand} />
            </CardContent>
        </Card>
    )
}
