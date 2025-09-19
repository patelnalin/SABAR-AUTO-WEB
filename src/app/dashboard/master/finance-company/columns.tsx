
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { financeCompanySchema } from "./schema";
import { DataTableRowActions } from "./data-table-row-actions";

export type FinanceCompany = z.infer<typeof financeCompanySchema> & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
};

export const columns: ColumnDef<FinanceCompany>[] = [
  {
    accessorKey: "companyName",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs">
          Company Name <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
  },
  {
    accessorKey: "licenseType",
    header: "License Type",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "state",
    header: "State",
  },
  {
    accessorKey: "mobileNumber",
    header: "Contact",
  },
   {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.original.status;
        return <Badge variant={status === 'Active' ? "default" : "secondary"} className="text-white">{status}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
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
