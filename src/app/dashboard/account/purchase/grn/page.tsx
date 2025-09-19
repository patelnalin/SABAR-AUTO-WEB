
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
import { MOCK_GRN_DATA } from "./data";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function GrnListPage() {
    const router = useRouter();

    const handleAddNew = () => {
        router.push("/dashboard/account/purchase/grn/add");
    }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Goods Receipt Notes (GRN)</CardTitle>
            <CardDescription>
              Track and manage all received goods against purchase orders.
            </CardDescription>
          </div>
          <Button onClick={handleAddNew} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New GRN
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={MOCK_GRN_DATA} />
      </CardContent>
    </Card>
  );
}
