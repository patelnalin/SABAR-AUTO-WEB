
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
import { useRouter } from "next/navigation";
import { MOCK_BILLS } from "./actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function MeetarBillPage() {
    const router = useRouter();

    const handleAddNew = () => {
        router.push("/dashboard/account/sales/meetarbill/add");
    }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Meetar Bill Details</CardTitle>
            <CardDescription>
              Manage, view, and create new Meetar bills.
            </CardDescription>
          </div>
          <Button onClick={handleAddNew} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Bill
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={MOCK_BILLS} />
      </CardContent>
    </Card>
  );
}
