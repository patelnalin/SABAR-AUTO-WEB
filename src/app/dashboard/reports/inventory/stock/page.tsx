
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload } from "lucide-react";
import { getStock } from "./actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function VehicleStockPage() {
  const stockData = await getStock();

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Inventory Stock Report</CardTitle>
            <CardDescription>
              A detailed report of all vehicle stock records.
            </CardDescription>
          </div>
           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
             <Button variant="outline" className="w-full sm:w-auto">
              <Upload className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={stockData} />
      </CardContent>
    </Card>
  );
}
