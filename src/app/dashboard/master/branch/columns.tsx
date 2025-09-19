
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { branchSchema } from "./schema";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./data-table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";


export type Branch = z.infer<typeof branchSchema> & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
};

export const columns: ColumnDef<Branch>[] = [
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
    accessorKey: "branchCode",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs">
          Branch Code <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
    cell: ({ row, table }) => {
      const meta = table.options.meta as { editingRowId: string | null, updateRow: (id: string, key: string, value: any) => void };
      const isEditing = meta.editingRowId === row.original.id;
      return isEditing ? (
        <input
          value={row.original.branchCode}
          onChange={(e) => meta.updateRow(row.original.id, 'branchCode', e.target.value)}
          className="w-full p-1 border rounded"
        />
      ) : (
        row.original.branchCode
      );
    }
  },
  {
    accessorKey: "branchName",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs">
          Branch Name <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
     cell: ({ row, table }) => {
      const meta = table.options.meta as { editingRowId: string | null, updateRow: (id: string, key: string, value: any) => void };
      const isEditing = meta.editingRowId === row.original.id;
      return isEditing ? (
        <input
          value={row.original.branchName}
          onChange={(e) => meta.updateRow(row.original.id, 'branchName', e.target.value)}
          className="w-full p-1 border rounded"
        />
      ) : (
        row.original.branchName
      );
    }
  },
    {
    accessorKey: "city",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs">
          City <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
     cell: ({ row, table }) => {
      const meta = table.options.meta as { editingRowId: string | null, updateRow: (id: string, key: string, value: any) => void };
      const isEditing = meta.editingRowId === row.original.id;
      return isEditing ? (
        <input
          value={row.original.city}
          onChange={(e) => meta.updateRow(row.original.id, 'city', e.target.value)}
          className="w-full p-1 border rounded"
        />
      ) : (
        row.original.city
      );
    }
  },
  {
    accessorKey: "state",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs">
          State <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
     cell: ({ row, table }) => {
      const meta = table.options.meta as { editingRowId: string | null, updateRow: (id: string, key: string, value: any) => void };
      const isEditing = meta.editingRowId === row.original.id;
      return isEditing ? (
        <input
          value={row.original.state}
          onChange={(e) => meta.updateRow(row.original.id, 'state', e.target.value)}
          className="w-full p-1 border rounded"
        />
      ) : (
        row.original.state
      );
    }
  },
  {
    accessorKey: "phone",
    header: "Phone",
     cell: ({ row, table }) => {
      const meta = table.options.meta as { editingRowId: string | null, updateRow: (id: string, key: string, value: any) => void };
      const isEditing = meta.editingRowId === row.original.id;
      return isEditing ? (
        <input
          value={row.original.phone}
          onChange={(e) => meta.updateRow(row.original.id, 'phone', e.target.value)}
          className="w-full p-1 border rounded"
        />
      ) : (
        row.original.phone
      );
    }
  },
  {
    accessorKey: "activeStatus",
    header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-2 py-1 h-auto text-xs">
          Status <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    ),
    cell: ({ row, table }) => {
        const meta = table.options.meta as { editingRowId: string | null, updateRow: (id: string, key: string, value: any) => void };
        const isEditing = meta.editingRowId === row.original.id;
        const isActive = row.original.activeStatus;
        return isEditing ? (
             <select
                value={String(isActive)}
                onChange={(e) => meta.updateRow(row.original.id, 'activeStatus', e.target.value === 'true')}
                className="w-full p-1 border rounded"
            >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
            </select>
        ) : (
            <Badge variant={isActive ? "default" : "secondary"} className="text-white">{isActive ? "Active" : "Inactive"}</Badge>
        )
    },
     filterFn: (row, id, value) => {
      const status = row.original.activeStatus ? 'Active' : 'Inactive';
      return value.includes(status);
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
