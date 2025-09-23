
import * as React from "react";
import { getCompanies, getCompanyById } from "../../actions";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Company } from "../../columns";
import { EditCompanyForm } from "./edit-form";


export async function generateStaticParams() {
    const companies = await getCompanies();
    return companies.map((company) => ({
        id: company.id,
    }));
}


export default async function EditCompanyPage({ params }: { params: { id: string } }) {
    const id = params.id;
    const company = await getCompanyById(id) as Company | null;

    return (
        <Card className="max-w-6xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>Edit Company</CardTitle>
                <CardDescription>
                    Update the details for company: {company?.companyName}
                </CardDescription>
            </CardHeader>
            <EditCompanyForm company={company} />
        </Card>
    )
}
