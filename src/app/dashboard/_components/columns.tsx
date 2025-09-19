"use client";

import { Badge } from "@/components/ui/badge";

export type Vehicle = {
  id: string;
  model: string;
  status: "Sold" | "In Stock" | "Booked";
  saleDate: string | null;
  customer: string | null;
};

// This is not a real ColumnDef from @tanstack/react-table, but a simplified version for our custom data table.
export type SimpleColumn = {
    accessorKey: keyof Vehicle;
    header: string;
    cell?: (props: { row: { original: Vehicle, getValue: (key: keyof Vehicle) => any } }) => React.ReactNode;
}

export const columns = [
  {
    accessorKey: "model",
    header: "Vehicle Model",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: { getValue: (key: string) => any }}) => {
      const status = row.getValue("status") as string;
      const variant = {
        "Sold": "destructive",
        "In Stock": "default",
        "Booked": "secondary",
      }[status] ?? "outline";
      
      return <Badge variant={variant as any} className="text-white">{status}</Badge>;
    },
  },
  {
    accessorKey: "customer",
    header: "Customer Name",
    cell: ({ row }: { row: { getValue: (key: string) => any }}) => row.getValue("customer") || "N/A",
  },
  {
    accessorKey: "saleDate",
    header: "Sale Date",
    cell: ({ row }: { row: { getValue: (key: string) => any }}) => {
        const dateString = row.getValue("saleDate") as string | null;
        if (!dateString) return "N/A";
        
        // Consistent date formatting to avoid hydration errors.
        // The issue was toLocaleDateString() can differ between server and client.
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${day}/${month}/${year}`;
    }
  },
  {
    accessorKey: "id",
    header: "Vehicle ID",
  },
];
