
import * as React from "react";
import { getBranchById, getBranches } from "../../actions";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Branch } from "../../columns";
import { EditBranchForm } from "./edit-form";

export async function generateStaticParams() {
    const branches = await getBranches();
    return branches.map((branch) => ({
        id: branch.id,
    }));
}

export default async function EditBranchPage({ params }: { params: { id: string } }) {
    const id = params.id;
    const branch = await getBranchById(id) as Branch | null;

    return (
        <Card className="max-w-6xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>Edit Branch</CardTitle>
                <CardDescription>
                    Update the details for branch: {branch?.branchName}
                </CardDescription>
            </CardHeader>
            <CardContent>
               <EditBranchForm branch={branch} />
            </CardContent>
        </Card>
    )
}
