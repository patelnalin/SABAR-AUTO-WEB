
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PurchaseOrder } from "./data";
import { DataTableRowActions } from "./data-table-row-actions";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";


export const columns: ColumnDef<PurchaseOrder>[] = [
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
  {
    accessorKey: "poNumber",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs">
        PO Number <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
  },
  {
    accessorKey: "poDate",
    header: "PO Date",
    cell: ({ row }) => format(new Date(row.original.poDate), "dd-MM-yyyy"),
  },
  {
    accessorKey: "branch",
    header: "Branch",
  },
  {
    accessorKey: "supplierName",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs">
        Supplier Name <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
  },
  {
    accessorKey: "invoiceNo",
    header: "Invoice No",
  },
  {
    accessorKey: "invoiceDate",
    header: "INV Date",
    cell: ({ row }) => row.original.invoiceDate ? format(new Date(row.original.invoiceDate), "dd-MM-yyyy") : 'N/A',
  },
  {
    accessorKey: "transporter",
    header: "Transporter",
  },
  {
    accessorKey: "truckNo",
    header: "Truck No.",
  },
  {
    accessorKey: "grandTotal",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs text-right w-full">
            Amount <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("grandTotal"));
      return <div className="text-right font-medium">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount)}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        deleteRow: (id: string) => void;
      };
      return <DataTableRowActions row={row} {...meta} />;
    },
  },
];
