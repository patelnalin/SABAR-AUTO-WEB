
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./data-table-row-actions";
import { brandSchema } from "./schema";


export type Brand = z.infer<typeof brandSchema> & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
};

export const columns: ColumnDef<Brand>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={(value) => table.toggleAllPageRowsSelected(!!value.target.checked)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
       <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={(value) => row.toggleSelected(!!value.target.checked)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "brandName",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs">
          Brand Name <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
    cell: ({ row, table }) => {
      const meta = table.options.meta as { editingRowId: string | null, updateRow: (id: string, key: string, value: any) => void };
      const isEditing = meta.editingRowId === row.original.id;
      return isEditing ? (
        <input
          value={row.original.brandName}
          onChange={(e) => meta.updateRow(row.original.id, 'brandName', e.target.value)}
          className="w-full p-1 border rounded"
        />
      ) : (
        row.original.brandName
      );
    }
  },
  {
    accessorKey: "countryOfOrigin",
    header: "Country of Origin",
    cell: ({ row, table }) => {
      const meta = table.options.meta as { editingRowId: string | null, updateRow: (id: string, key: string, value: any) => void };
      const isEditing = meta.editingRowId === row.original.id;
      return isEditing ? (
        <input
          value={row.original.countryOfOrigin}
          onChange={(e) => meta.updateRow(row.original.id, 'countryOfOrigin', e.target.value)}
          className="w-full p-1 border rounded"
        />
      ) : (
        row.original.countryOfOrigin
      );
    }
  },
  {
    accessorKey: "establishedYear",
    header: "Established Year",
    cell: ({ row, table }) => {
      const meta = table.options.meta as { editingRowId: string | null, updateRow: (id: string, key: string, value: any) => void };
      const isEditing = meta.editingRowId === row.original.id;
      return isEditing ? (
        <input
          type="number"
          value={row.original.establishedYear}
          onChange={(e) => meta.updateRow(row.original.id, 'establishedYear', Number(e.target.value))}
          className="w-full p-1 border rounded"
        />
      ) : (
        row.original.establishedYear
      );
    }
  },
  {
    accessorKey: "headquarterLocation",
    header: "Headquarters",
    cell: ({ row, table }) => {
      const meta = table.options.meta as { editingRowId: string | null, updateRow: (id: string, key: string, value: any) => void };
      const isEditing = meta.editingRowId === row.original.id;
      return isEditing ? (
        <input
          value={row.original.headquarterLocation || ''}
          onChange={(e) => meta.updateRow(row.original.id, 'headquarterLocation', e.target.value)}
          className="w-full p-1 border rounded"
        />
      ) : (
        row.original.headquarterLocation
      );
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs">
          Status <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
    cell: ({ row, table }) => {
        const meta = table.options.meta as { editingRowId: string | null, updateRow: (id: string, key: string, value: any) => void };
        const isEditing = meta.editingRowId === row.original.id;
        const status = row.original.status;
        return isEditing ? (
             <select
                value={status}
                onChange={(e) => meta.updateRow(row.original.id, 'status', e.target.value)}
                className="w-full p-1 border rounded"
            >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
            </select>
        ) : (
            <Badge variant={status === 'Active' ? "default" : "secondary"} className="text-white">{status}</Badge>
        )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        editRow: (id: string) => void;
        cancelEdit: () => void;
        saveRow: (id: string) => void;
        deleteRow: (id: string) => void;
        editingRowId: string | null;
      };
      return <DataTableRowActions row={row} {...meta} />;
    },
  },
];
