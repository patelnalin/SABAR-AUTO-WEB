
import * as React from "react";
import { getInsuranceCompanies, getInsuranceCompanyById, getStates } from "../../actions";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { InsuranceCompany } from "../../columns";
import { EditInsuranceCompanyForm } from "./edit-form";

export async function generateStaticParams() {
    const companies = await getInsuranceCompanies();
    return companies.map((company) => ({
        id: company.id,
    }));
}

export default async function EditInsuranceCompanyPage({ params }: { params: { id: string } }) {
    const id = params.id;
    const [company, states] = await Promise.all([
        getInsuranceCompanyById(id),
        getStates()
    ]);

    return (
        <Card className="max-w-6xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>Edit Insurance Company</CardTitle>
                <CardDescription>
                    Update the details for company: {company?.companyName}
                </CardDescription>
            </CardHeader>
            <CardContent>
               <EditInsuranceCompanyForm 
                    company={company as InsuranceCompany | null} 
                    stateNames={states} 
                />
            </CardContent>
        </Card>
    )
}
