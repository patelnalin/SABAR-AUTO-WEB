
"use client";

import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Upload } from "lucide-react";
import { getAddresses } from "./actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Address } from "./columns";

export default function CityVillagePage() {
  const [data, setData] = useState<Address[]>([]);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getAddresses().then(setData);
  }, []);

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "File Selected",
        description: `${file.name} is ready for upload. Backend implementation is pending.`,
      });
      // Reset file input
      event.target.value = '';
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Address Management</CardTitle>
            <CardDescription>
              View, add, edit, and manage all addresses.
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".xlsx, .xls, .csv, .pdf"
            />
            <Button onClick={handleFileUploadClick} variant="outline" className="w-full sm:w-auto">
              <Upload className="mr-2 h-4 w-4" />
              Upload Excel/PDF
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/dashboard/master/city-village/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
