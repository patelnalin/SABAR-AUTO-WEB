
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
import { getVouchers } from "./actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function VoucherPage() {
  const vouchers = await getVouchers();

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Voucher Management</CardTitle>
            <CardDescription>
              Create, track, and manage all financial vouchers.
            </CardDescription>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/account/voucher/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Voucher
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={vouchers} />
      </CardContent>
    </Card>
  );
}
