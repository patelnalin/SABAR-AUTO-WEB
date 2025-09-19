
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { financialYearSchema } from "./schema";
import { DataTableRowActions } from "./data-table-row-actions";


export type FinancialYear = z.infer<typeof financialYearSchema> & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
};

export const columns: ColumnDef<FinancialYear>[] = [
  {
    accessorKey: "yearName",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs">
        Financial Year <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => format(new Date(row.getValue("startDate")), "dd/MM/yyyy"),
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => format(new Date(row.getValue("endDate")), "dd/MM/yyyy"),
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
      const variant = status === "Active" ? "default" : "secondary";
      return <Badge variant={variant} className="text-white">{status}</Badge>;
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => format(new Date(row.getValue("createdAt")), "dd/MM/yyyy"),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => format(new Date(row.getValue("updatedAt")), "dd/MM/yyyy"),
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const meta = table.options.meta as { deleteRow: (id: string) => void };
      return <DataTableRowActions row={row} {...meta} />;
    },
  },
];
