
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { paymentSchema } from "./schema";
import { DataTableRowActions } from "./data-table-row-actions";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

export type Payment = z.infer<typeof paymentSchema> & {
    id: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
};

export const columns: ColumnDef<Payment>[] = [
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
        accessorKey: "paymentType",
        header: "Payment Type",
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: "paymentDate",
        header: "Payment Date",
        cell: ({ row }) => format(row.original.paymentDate, "dd/MM/yyyy"),
    },
    {
        accessorKey: "customerName",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs">
                Customer <ArrowUpDown className="ml-2 h-3 w-3" />
            </Button>
        ),
    },
    {
        accessorKey: 'vehicleModel',
        header: 'Vehicle Details',
        cell: ({ row }) => (
            <div>
                <div>{row.original.vehicleModel}</div>
                <div className="text-muted-foreground text-xs">{row.original.chassisNo}</div>
            </div>
        )
    },
    {
        accessorKey: "amount",
        header: "Amount Paid",
        cell: ({ row }) => {
            const amount = parseFloat(String(row.getValue("amount")));
            const color = amount < 0 ? "text-destructive" : "";
            return <div className={cn("font-medium", color)}>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount)}</div>;
        },
    },
    {
        accessorKey: "paymentMode",
        header: "Method",
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: "paymentStatus",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.paymentStatus;
            const variant = {
                "Completed": "default",
                "Pending": "secondary",
                "Failed": "destructive",
                "Partial": "outline",
            }[status] as "default" | "secondary" | "destructive" | "outline";
            return <Badge variant={variant} className="text-white">{status}</Badge>;
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const meta = table.options.meta as { deleteRow: (id: string) => void };
            return <DataTableRowActions row={row} {...meta} />;
        },
    },
];
