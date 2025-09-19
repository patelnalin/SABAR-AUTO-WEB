
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { insuranceCompanySchema } from "./schema";
import { DataTableRowActions } from "./data-table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";


export type InsuranceCompany = z.infer<typeof insuranceCompanySchema> & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
};

export const columns: ColumnDef<InsuranceCompany>[] = [
    {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
    accessorKey: "companyName",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs">
          Company Name <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
  },
  {
    accessorKey: "companyCode",
    header: "Code",
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
    accessorKey: "contactNumber",
    header: "Contact",
  },
   {
    accessorKey: "servicesOffered",
    header: "Services",
    cell: ({ row }) => {
        const services = row.original.servicesOffered;
        return <div className="flex flex-wrap gap-1">{services.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}</div>
    }
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
