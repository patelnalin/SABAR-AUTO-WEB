
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { insuranceSchema } from "./schema";
import { DataTableRowActions } from "./data-table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";


export type InsurancePolicy = z.infer<typeof insuranceSchema> & {
    id: string;
    renewalStatus: "Active" | "Expired" | "Renewal Due";
};

export const columns: ColumnDef<InsurancePolicy>[] = [
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
        accessorKey: "policyNumber",
        header: "Policy Number",
    },
    {
        accessorKey: "policyType",
        header: "Type",
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: "insuranceCompany",
        header: "Company",
    },
    {
        accessorKey: "policyHolderName",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs">
                Holder Name <ArrowUpDown className="ml-2 h-3 w-3" />
            </Button>
        ),
    },
    {
        accessorKey: "endDate",
        header: "Expiry Date",
        cell: ({ row }) => format(row.original.endDate, "dd/MM/yyyy"),
    },
    {
        accessorKey: "premiumAmount",
        header: "Premium",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("premiumAmount"));
            return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
        },
    },
    {
        accessorKey: "renewalStatus",
        header: "Renewal",
        cell: ({ row }) => {
            const status = row.original.renewalStatus;
            const variant = {
                "Active": "default",
                "Expired": "destructive",
                "Renewal Due": "secondary",
            }[status] as "default" | "secondary" | "destructive";
            return <Badge variant={variant} className="text-white">{status}</Badge>;
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            return <Badge variant={status === 'Active' ? 'outline' : 'secondary'}>{status}</Badge>;
        },
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const meta = table.options.meta as { deleteRow: (id: string) => void };
            return <DataTableRowActions row={row} {...meta} />;
        },
    },
];

