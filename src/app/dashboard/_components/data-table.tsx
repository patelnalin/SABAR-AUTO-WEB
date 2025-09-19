"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function DataTable({ columns, data }: { columns: any[], data: any[] }) {
    const [filter, setFilter] = React.useState('');
    const [currentPage, setCurrentPage] = React.useState(1);
    const rowsPerPage = 5;

    const filteredData = React.useMemo(() => {
        if (!filter) return data;
        return data.filter(row => 
            Object.values(row).some(value => 
                String(value).toLowerCase().includes(filter.toLowerCase())
            )
        );
    }, [data, filter]);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = React.useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return filteredData.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredData, currentPage, rowsPerPage]);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

  return (
    <div className="space-y-4">
        <div className="flex items-center">
            <Input
            placeholder="Search all columns..."
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="max-w-sm"
            />
        </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
              <TableRow>
                {columns.map((column) => (
                    <TableHead key={column.accessorKey}>{column.header}</TableHead>
                ))}
              </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length ? (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={row.id || rowIndex}>
                    {columns.map((column) => {
                        const cellValue = row[column.accessorKey];
                        const mockRow = {
                            getValue: (key: string) => row[key]
                        }
                        if (column.cell) {
                            return <TableCell key={column.accessorKey}>{column.cell({ row: mockRow })}</TableCell>
                        }
                        return <TableCell key={column.accessorKey}>{cellValue}</TableCell>
                    })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {Math.min((currentPage - 1) * rowsPerPage + 1, filteredData.length)} to {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} entries.
        </div>
        <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
        >
            Previous
        </Button>
        <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage >= totalPages}
        >
            Next
        </Button>
      </div>
    </div>
  )
}
