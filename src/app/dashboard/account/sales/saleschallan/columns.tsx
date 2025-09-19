
"use client";

import { format } from "date-fns";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Booking } from "./data";
import { Checkbox } from "@/components/ui/checkbox";

export const getColumns = ({ onEdit, onDelete, onSelect, onSelectAll, isAllSelected, isRowSelected }: { onEdit: (booking: Booking) => void; onDelete: (id: string) => void; onSelect: (id: string, checked: boolean) => void; onSelectAll: (checked: boolean) => void; isAllSelected: boolean, isRowSelected: (id: string) => boolean; }) => [
     {
        key: "select",
        header: (
            <Checkbox
                checked={isAllSelected}
                onCheckedChange={(value) => onSelectAll(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }: { row: { original: Booking } }) => (
            <Checkbox
                checked={isRowSelected(row.original.id)}
                onCheckedChange={(value) => onSelect(row.original.id, !!value)}
                aria-label="Select row"
            />
        ),
    },
    {
        key: "bookingId",
        header: "Booking ID",
        accessorKey: "id",
    },
    {
        key: "customerName",
        header: "Customer",
        accessorKey: "customerName",
    },
    {
        key: "phone",
        header: "Phone",
        accessorKey: "phoneNumber",
    },
    {
        key: "vehicle",
        header: "Vehicle",
        cell: ({ row }: { row: { original: Booking } }) => `${row.original.vehicleMake} ${row.original.vehicleModel}`,
    },
    {
        key: "bookingDate",
        header: "Booking Date",
        accessorKey: "bookingDate",
        cell: ({ row }: { row: { original: Booking } }) => format(new Date(row.original.bookingDate), "dd/MM/yyyy"),
    },
    {
        key: "onRoadPrice",
        header: "On-Road Price",
        accessorKey: "onRoadPrice",
        cell: ({ row }: { row: { original: Booking } }) => `₹${row.original.onRoadPrice.toLocaleString('en-IN')}`,
    },
    {
        key: "status",
        header: "Status",
        accessorKey: "bookingStatus",
        cell: ({ row }: { row: { original: Booking } }) => {
            const status = row.original.bookingStatus;
            const variant = {
                "Pending": "secondary",
                "Confirmed": "default",
                "Cancelled": "destructive",
            }[status] as "secondary" | "default" | "destructive";
            return <Badge variant={variant} className="text-white text-[10px] px-1.5 py-0.5">{status}</Badge>;
        },
    },
    {
        key: "actions",
        header: "Actions",
        cell: ({ row }: { row: { original: Booking } }) => (
            <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => onEdit(row.original)} className="h-6 w-6">
                    <Edit className="h-3.5 w-3.5" />
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-6 w-6">
                            <Trash className="h-3.5 w-3.5" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the booking for "{row.original.customerName}". This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(row.original.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        ),
    },
];
