
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
import { getBrands } from "./actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function BrandPage() {
  const brands = await getBrands();

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Vehicle Brand Management</CardTitle>
            <CardDescription>
              View, add, edit, and manage all vehicle brands.
            </CardDescription>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/master/vehicle/brand/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Brand
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={brands} />
      </CardContent>
    </Card>
  );
}
