
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./data-table-row-actions";
import { modelSchema } from "./schema";
import { Checkbox } from "@/components/ui/checkbox";


export type Model = z.infer<typeof modelSchema> & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
};

export const columns: ColumnDef<Model>[] = [
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
    accessorKey: "modelCode",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs">
          Model Code <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
  },
  {
    accessorKey: "modelName",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs">
          Model Name <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
  },
  {
    accessorKey: "brandName",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs">
          Brand <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "fuelType",
    header: "Fuel Type",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "engineCapacity",
    header: "Engine (CC)",
  },
  {
    accessorKey: "transmissionType",
    header: "Transmission",
  },
  {
    accessorKey: "launchYear",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs">
          Launch Year <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
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
        return <Badge variant={status === 'Active' ? "default" : "secondary"} className="text-white">{status}</Badge>
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
