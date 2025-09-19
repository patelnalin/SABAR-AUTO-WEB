
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { MOCK_INVOICES } from "./data";
import { useRouter } from "next/navigation";


export default function PurchaseInvoicePage() {
    const router = useRouter();

    const handleAddNew = () => {
        router.push("/dashboard/account/purchase/purchase-invoice/add");
    }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Purchase Invoice Management</CardTitle>
            <CardDescription>
              Track, manage, and process all supplier invoices.
            </CardDescription>
          </div>
          <Button onClick={handleAddNew} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Invoice
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={MOCK_INVOICES} />
      </CardContent>
    </Card>
  );
}
