
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleStock } from "./schema";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<VehicleStock>[] = [
  {
    accessorKey: "creationDate",
    header: "Creation Date",
     cell: ({ row }) => format(row.original.creationDate, "dd/MM/yyyy"),
  },
  {
    accessorKey: "poNumber",
    header: "PO Number",
  },
    {
    accessorKey: "poInvoiceDate",
    header: "PO Invoice Date",
    cell: ({ row }) => row.original.poInvoiceDate ? format(row.original.poInvoiceDate, "dd/MM/yyyy") : 'N/A',
  },
  {
    accessorKey: "modelCode",
    header: "Model Code",
  },
  {
    accessorKey: "modelName",
    header: "Model Name",
  },
   {
    accessorKey: "colorCode",
    header: "Color Code",
  },
  {
    accessorKey: "color",
    header: "Color",
  },
  {
    accessorKey: "poInvoiceNo",
    header: "PO Invoice No",
  },
  {
    accessorKey: "chassisNo",
    header: "Chassis No",
  },
    {
    accessorKey: "engineNo",
    header: "Engine No",
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs">
          Status <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
    cell: ({ row }) => {
      const status = row.original.status;
       const variant = {
        "In Stock": "default",
        "Sold": "destructive",
        "Reserved": "secondary",
        "In Transit": "outline",
      }[status] as "default" | "secondary" | "destructive" | "outline";
      return <Badge variant={variant} className="text-white">{status}</Badge>;
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
   {
    accessorKey: "batteryNo",
    header: "Battery No",
  },
  {
    accessorKey: "supplierName",
    header: "Supplier Name",
  },
  {
    accessorKey: "cost",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs text-right w-full">
            Cost <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(String(row.getValue("cost")));
      return <div className="text-right font-medium">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount)}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
