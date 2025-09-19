
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { getBranches } from "./actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function BranchPage() {
  const branches = await getBranches();

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Branch Management</CardTitle>
            <CardDescription>
              View, add, edit, and manage all company branches.
            </CardDescription>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/master/branch/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Branch
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={branches} />
      </CardContent>
    </Card>
  );
}
