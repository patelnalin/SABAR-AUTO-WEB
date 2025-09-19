
"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
  RowData,
  RowSelectionState,
} from "@tanstack/react-table";
import { z } from "zod";
import { brandSchema } from "./schema";
import { editBrand } from "./actions";
import { useToast } from "@/hooks/use-toast";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Brand } from "./columns";

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    editingRowId: string | null;
    setEditingRowId: React.Dispatch<React.SetStateAction<string | null>>;
    editRow: (id: string) => void;
    cancelEdit: () => void;
    saveRow: (id: string) => void;
    deleteRow: (id: string) => void;
    updateRow: (id: string, key: string, value: any) => void;
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends Brand, TValue>({
  columns,
  data: initialData,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = React.useState(initialData);
  const [originalData, setOriginalData] = React.useState(initialData);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [editingRowId, setEditingRowId] = React.useState<string | null>(null);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const { toast } = useToast();

  React.useEffect(() => {
    setData(initialData);
    setOriginalData(initialData);
  }, [initialData]);

  const tableMeta = React.useMemo(() => ({
    editingRowId,
    setEditingRowId,
    editRow: (id: string) => {
        setOriginalData(JSON.parse(JSON.stringify(data))); // Deep copy for restoration
        setEditingRowId(id);
    },
    cancelEdit: () => {
        setData(originalData); // Restore original data on cancel
        setEditingRowId(null);
    },
    saveRow: async (id: string) => {
        const rowToSave = data.find(row => row.id === id);
        if (!rowToSave) return;
        
        const validatedData = brandSchema.safeParse(rowToSave);
        if (!validatedData.success) {
            toast({ title: "Validation Error", description: validatedData.error.errors.map(e => e.message).join(", "), variant: "destructive"});
            return;
        }

        const result = await editBrand(id, validatedData.data);
         if (result.success) {
            toast({ title: "Success", description: result.message });
        } else {
            toast({ title: "Error", description: result.message, variant: "destructive" });
            setData(originalData); // Restore on failed save
        }
        setEditingRowId(null);
    },
    deleteRow: (id: string) => {
        setData(prev => prev.filter(row => row.id !== id));
    },
    updateRow: (id: string, key: string, value: any) => {
        setData(prev => prev.map(row => (row.id === id ? { ...row, [key]: value } : row)));
    },
  }), [editingRowId, data, originalData, toast]);

  const table = useReactTable({
    data,
    columns,
    meta: tableMeta,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection
    },
  });

  return (
    <div className="border border-gray-300 rounded-sm">
        <div className="bg-gray-100 dark:bg-gray-800 p-2 border-b border-gray-300 text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center justify-between">
            <span>Brand Records</span>
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <Button variant="destructive" size="sm">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete ({table.getFilteredSelectedRowModel().rows.length})
                </Button>
            )}
        </div>
        <div className="flex items-center gap-2 p-2">
            <div className="relative w-full sm:max-w-xs">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Filter by brand name..."
                    value={(table.getColumn("brandName")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("brandName")?.setFilterValue(event.target.value)
                    }
                    className="pl-8"
                />
            </div>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                    Status
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {['Active', 'Inactive'].map((status) => {
                         const statusFilter = (table.getColumn("status")?.getFilterValue() as string[] || []);
                        return (
                            <DropdownMenuCheckboxItem
                                key={status}
                                checked={statusFilter.includes(status)}
                                onCheckedChange={(checked) => {
                                    const currentFilter = statusFilter;
                                    const newFilter = checked
                                        ? [...currentFilter, status]
                                        : currentFilter.filter(s => s !== status);
                                    table.getColumn('status')?.setFilterValue(newFilter.length ? newFilter : undefined);
                                }}
                            >
                                {status}
                            </DropdownMenuCheckboxItem>
                        )
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-200/50 dark:bg-gray-700/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead key={header.id} className={cn("px-2 h-auto text-xs whitespace-nowrap", index > 0 && "border-l border-gray-300")}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn("text-xs", rowIndex % 2 === 0 ? 'bg-white dark:bg-gray-900/50' : 'bg-gray-50 dark:bg-gray-800/50')}
                >
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <TableCell key={cell.id} className={cn("p-2 whitespace-nowrap", cellIndex > 0 && "border-l border-gray-200")}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between p-2 border-t border-gray-300 bg-gray-100 dark:bg-gray-800 text-xs">
        <div className="flex-1 text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
            <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            >
            Previous
            </Button>
            <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            >
            Next
            </Button>
        </div>
      </div>
    </div>
  );
}
