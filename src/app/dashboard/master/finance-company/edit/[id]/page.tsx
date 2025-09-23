
import * as React from "react";
import { getFinanceCompanies, getFinanceCompanyById, getStates } from "../../actions";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { FinanceCompany } from "../../columns";
import { EditFinanceCompanyForm } from "./edit-form";

export async function generateStaticParams() {
    const companies = await getFinanceCompanies();
     return companies.map((company) => ({
        id: company.id,
    }));
}


export default async function EditFinanceCompanyPage({ params }: { params: { id: string } }) {
    const id = params.id;
    const [company, states] = await Promise.all([
        getFinanceCompanyById(id),
        getStates()
    ]);
    
    return (
        <Card className="max-w-6xl mx-auto shadow-lg">
            <CardContent>
               <EditFinanceCompanyForm 
                    company={company as FinanceCompany | null} 
                    stateNames={states} 
                />
            </CardContent>
        </Card>
    )
}
