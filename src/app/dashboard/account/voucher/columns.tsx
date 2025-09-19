
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { voucherSchema } from "./schema";
import { DataTableRowActions } from "./data-table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";


export type Voucher = z.infer<typeof voucherSchema> & {
    id: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
};

export const columns: ColumnDef<Voucher>[] = [
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
    accessorKey: "voucherNumber",
    header: "Voucher No.",
  },
  {
    accessorKey: "voucherDate",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs">
        Date <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => format(new Date(row.getValue("voucherDate")), "dd/MM/yyyy"),
  },
  {
    accessorKey: "voucherType",
    header: "Type",
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "accountName",
    header: "Account",
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs text-right w-full">
            Amount <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return <div className="text-right font-medium">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount)}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs">
          Status <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant = {
        Posted: "default",
        Draft: "secondary",
        Cancelled: "destructive",
      }[status] as "default" | "secondary" | "destructive";
      return <Badge variant={variant} className="text-white">{status}</Badge>;
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const meta = table.options.meta as { deleteRow: (id: string) => void };
      return <DataTableRowActions row={row} {...meta} />;
    },
  },
];
