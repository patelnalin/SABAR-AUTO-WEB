
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Invoice } from "./data";
import { DataTableRowActions } from "./data-table-row-actions";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";


export const columns: ColumnDef<Invoice>[] = [
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
    accessorKey: "invoiceNumber",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs">
        Invoice No. <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
  },
  {
    accessorKey: "invoiceDate",
    header: "Invoice Date",
    cell: ({ row }) => format(row.original.invoiceDate, "dd/MM/yyyy"),
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
      accessorKey: "poNumber",
      header: "PO Number"
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
        "Draft": "outline",
        "Pending Approval": "secondary",
        "Approved": "default",
        "Paid": "outline",
        "Cancelled": "destructive",
      }[status] as "default" | "secondary" | "destructive" | "outline";
       const color = {
        "Approved": "bg-blue-500",
        "Paid": "bg-green-600"
      }[status]
      return <Badge variant={variant} className={cn("text-white", color)}>{status}</Badge>;
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "grandTotal",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs text-right w-full">
            Grand Total <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("grandTotal"));
      return <div className="text-right font-medium">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount)}</div>;
    },
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <DataTableRowActions row={row} />;
    },
  },
];
