
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GRN } from "./data";
import { DataTableRowActions } from "./data-table-row-actions";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<GRN>[] = [
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
    accessorKey: "grnNo",
    header: "GRN No",
  },
  {
    accessorKey: "grnDate",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs">
        GRN Date <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => format(row.original.grnDate, "dd/MM/yyyy"),
  },
  {
    accessorKey: "poNo",
    header: "PO No",
  },
  {
    accessorKey: "branch",
    header: "Branch",
  },
  {
    accessorKey: "supplierName",
    header: "Supplier Name",
  },
  {
    accessorKey: "invoiceNo",
    header: "Invoice No",
  },
    {
    accessorKey: "invoiceDate",
    header: "INV Date",
    cell: ({ row }) => format(row.original.invoiceDate, "dd/MM/yyyy"),
  },
  {
    accessorKey: "qty",
    header: "Total Qty",
  },
   {
    accessorKey: "amount",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs text-right w-full">
            Total Amount <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(String(row.original.amount));
      return <div className="text-right font-medium">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount)}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variant = {
        "Draft": "secondary",
        "Approved": "default",
      }[status] as "default" | "secondary";
      const color = {
        "Approved": "bg-green-600",
      }[status];
      return <Badge variant={variant} className={cn("text-white", color)}>{status}</Badge>;
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
