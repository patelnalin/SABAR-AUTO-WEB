
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { cityVillageSchema } from "./schema";
import { DataTableRowActions } from "./data-table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";


export type Address = z.infer<typeof cityVillageSchema> & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
};

export const columns: ColumnDef<Address>[] = [
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
    accessorKey: "village",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs">
          Village <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
  },
  {
    accessorKey: "post",
    header: "Post",
  },
  {
    accessorKey: "city",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs">
          City <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
  },
    {
    accessorKey: "state",
    header: "State",
  },
  {
    accessorKey: "pincode",
    header: "PIN Code",
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
