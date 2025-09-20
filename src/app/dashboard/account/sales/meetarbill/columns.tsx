
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { DataTableRowActions } from "./data-table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { billSchema } from "./schema";

export type Bill = z.infer<typeof billSchema> & {
    id: string;
    amount: number;
}

export const columns: ColumnDef<Bill>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    { accessorKey: "id", header: "Bill ID" },
    { 
        accessorKey: "billDate", 
        header: "Date",
        cell: ({ row }) => format(row.original.billDate, "dd/MM/yyyy"),
    },
    { accessorKey: "customerName", header: "Customer Name" },
    { accessorKey: "city", header: "City" },
    { accessorKey: "mobile", header: "Mobile" },
    { accessorKey: "vehicleModel", header: "Vehicle Model" },
    { accessorKey: "chassisNo", header: "Chassis No" },
    { accessorKey: "certificateNo", header: "Certificate No" },
    { accessorKey: "meterNo", header: "Meter No" },
    { 
        accessorKey: "amount", 
        header: "Amount",
        cell: ({ row }) => `₹${Number(row.original.amount).toFixed(2)}`
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
