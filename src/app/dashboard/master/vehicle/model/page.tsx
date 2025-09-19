
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
import { getModels } from "./actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function ModelPage() {
  const models = await getModels();

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Vehicle Model Management</CardTitle>
            <CardDescription>
              View, add, edit, and manage all vehicle models.
            </CardDescription>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/master/vehicle/model/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Model
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={models} />
      </CardContent>
    </Card>
  );
}
