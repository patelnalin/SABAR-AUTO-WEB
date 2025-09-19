
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
import { getFinancialYears } from "./actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function YearPage() {
  const years = await getFinancialYears();

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Financial Year Management</CardTitle>
            <CardDescription>
              Manage financial years for accounting and reporting.
            </CardDescription>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/master/year/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Year
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={years} />
      </CardContent>
    </Card>
  );
}
