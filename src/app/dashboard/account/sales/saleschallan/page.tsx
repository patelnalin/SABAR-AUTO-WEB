
"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    PlusCircle,
    Search,
    ChevronsLeft,
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Booking, initialBookings } from "./data";
import { getColumns } from "./columns";
import { cn } from "@/lib/utils";

export default function SalesChallanPage() {
    const [bookings, setBookings] = useState<Booking[]>(initialBookings);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
    
    const router = useRouter();
    const { toast } = useToast();

    const handleEdit = (booking: Booking) => {
        // In a real app, you would navigate to an edit page.
        // For now, we'll just show a toast as a placeholder.
        toast({ title: "Info", description: `Editing for ${booking.customerName}. To be implemented.` });
    };

    const handleAddNew = () => {
        router.push('/dashboard/account/sales/saleschallan/add');
    }
    
    const handleDelete = (id: string) => {
        setBookings(bookings.filter(b => b.id !== id));
        toast({ title: "Deleted", description: "Booking has been deleted.", variant: "destructive" });
    };

    const filteredBookings = useMemo(() => {
        return bookings.filter(booking => {
            const matchesSearch = searchTerm === "" ||
                booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.chassisNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.engineNumber.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === "All" || booking.bookingStatus === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [bookings, searchTerm, statusFilter]);

    const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);
    const paginatedBookings = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return filteredBookings.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredBookings, currentPage, rowsPerPage]);

    const handleSelect = (id: string, checked: boolean) => {
        setRowSelection(prev => ({ ...prev, [id]: checked }));
    }

    const handleSelectAll = (checked: boolean) => {
        const newSelection: Record<string, boolean> = {};
        if (checked) {
            paginatedBookings.forEach(booking => newSelection[booking.id] = true);
        }
        setRowSelection(newSelection);
    }
    
    const selectedRowCount = Object.values(rowSelection).filter(Boolean).length;
    const isAllOnPageSelected = selectedRowCount === paginatedBookings.length && paginatedBookings.length > 0;

    const columns = getColumns({ 
        onEdit: handleEdit, 
        onDelete: handleDelete,
        onSelect: handleSelect,
        onSelectAll: handleSelectAll,
        isAllSelected: isAllOnPageSelected,
        isRowSelected: (id) => !!rowSelection[id],
    });


    return (
        <>
            <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Customer Bookings</CardTitle>
                            <CardDescription>Manage all vehicle purchase bookings.</CardDescription>
                        </div>
                        <Button onClick={handleAddNew} className="w-full sm:w-auto">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New Booking
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by customer, vehicle..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Statuses</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Confirmed">Confirmed</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="border border-gray-300 rounded-sm">
                         <div className="bg-gray-100 dark:bg-gray-800 p-2 border-b border-gray-300 text-sm font-semibold text-gray-700 dark:text-gray-200">
                            Booking Records
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-gray-200/50 dark:bg-gray-700/50">
                                    <TableRow>
                                        {columns.map((column, index) => (
                                            <TableHead key={column.key} className={cn("px-2 h-auto text-xs whitespace-nowrap", index > 0 && "border-l border-gray-300")}>
                                                {column.header}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedBookings.length > 0 ? (
                                        paginatedBookings.map((booking, rowIndex) => (
                                            <TableRow key={booking.id} className={cn("text-xs", rowIndex % 2 === 0 ? 'bg-white dark:bg-gray-900/50' : 'bg-gray-50 dark:bg-gray-800/50')}>
                                                {columns.map((column, cellIndex) => (
                                                    <TableCell key={column.key} className={cn("p-2 whitespace-nowrap", cellIndex > 0 && "border-l border-gray-200")}>
                                                        {column.cell ? column.cell({ row: { original: booking } }) : (booking as any)[column.accessorKey!]}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                                No bookings found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-between p-2 border-t border-gray-300 bg-gray-100 dark:bg-gray-800 text-xs">
                             <div className="flex-1 text-sm text-muted-foreground">
                                {selectedRowCount} of {paginatedBookings.length} row(s) selected on this page.
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Rows per page:</span>
                                <Select
                                    value={`${rowsPerPage}`}
                                    onValueChange={(value) => {
                                        setRowsPerPage(Number(value));
                                        setCurrentPage(1);
                                    }}
                                >
                                    <SelectTrigger className="h-7 w-[70px]">
                                        <SelectValue placeholder={rowsPerPage} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[10, 25, 50].map((pageSize) => (
                                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                                {pageSize}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="text-muted-foreground">Page {totalPages > 0 ? currentPage : 0} of {totalPages}</div>
                            <div className="flex items-center space-x-1">
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                                    <ChevronsLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage >= totalPages}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setCurrentPage(totalPages)} disabled={currentPage >= totalPages}>
                                    <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </div>
                             <div className="text-muted-foreground">
                                Showing {paginatedBookings.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
                                {Math.min(currentPage * rowsPerPage, filteredBookings.length)} of {filteredBookings.length}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
