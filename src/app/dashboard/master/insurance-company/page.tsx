
"use client";

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
import { getInsuranceCompanies } from "./actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";
import { InsuranceCompany } from "./columns";

export default function InsuranceCompanyPage() {
  const [data, setData] = useState<InsuranceCompany[]>([]);

  useEffect(() => {
    getInsuranceCompanies().then(setData);
  }, []);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Insurance Company Management</CardTitle>
            <CardDescription>
              View, add, edit, and manage all insurance companies.
            </CardDescription>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/master/insurance-company/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Company
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
