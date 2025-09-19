
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Edit, Trash, ChevronUp, ChevronDown, Search, PlusCircle, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
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
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export type LeaveApplication = {
  id: string;
  employeeId: string;
  employeeName: string;
  department: "HR" | "Sales" | "IT" | "Accounts";
  leaveType: "Casual Leave" | "Sick Leave" | "Paid Leave" | "Maternity Leave" | "Unpaid Leave";
  fromDate: Date;
  toDate: Date;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
};

const initialLeaves: LeaveApplication[] = [
    { id: '1', employeeId: 'EMP001', employeeName: 'Aarav Sharma', department: 'IT', leaveType: 'Casual Leave', fromDate: new Date('2024-07-20'), toDate: new Date('2024-07-21'), reason: 'Family function', status: 'Approved' },
    { id: '2', employeeId: 'EMP002', employeeName: 'Diya Patel', department: 'Sales', leaveType: 'Sick Leave', fromDate: new Date('2024-08-01'), toDate: new Date('2024-08-03'), reason: 'Fever', status: 'Pending' },
    { id: '3', employeeId: 'EMP004', employeeName: 'Priya Singh', department: 'Accounts', leaveType: 'Paid Leave', fromDate: new Date('2024-07-25'), toDate: new Date('2024-07-28'), reason: 'Vacation', status: 'Rejected' },
    { id: '4', employeeId: 'EMP003', employeeName: 'Rohan Gupta', department: 'HR', leaveType: 'Sick Leave', fromDate: new Date('2024-08-05'), toDate: new Date('2024-08-06'), reason: 'Cold', status: 'Pending' },
    { id: '5', employeeId: 'EMP001', employeeName: 'Aarav Sharma', department: 'IT', leaveType: 'Unpaid Leave', fromDate: new Date('2024-09-10'), toDate: new Date('2024-09-15'), reason: 'Personal reasons', status: 'Approved' },
    { id: '6', employeeId: 'EMP002', employeeName: 'Diya Patel', department: 'Sales', leaveType: 'Maternity Leave', fromDate: new Date('2025-01-01'), toDate: new Date('2025-06-30'), reason: 'Maternity', status: 'Approved' },
];

type SortConfig = {
    key: keyof LeaveApplication;
    direction: 'ascending' | 'descending';
} | null;

export default function LeavesPage() {
    const [leaves, setLeaves] = React.useState<LeaveApplication[]>(initialLeaves);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [sortConfig, setSortConfig] = React.useState<SortConfig>({ key: 'fromDate', direction: 'descending' });
    const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
    const { toast } = useToast();
    const router = useRouter();

    const [currentPage, setCurrentPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);


    const handleEdit = (leave: LeaveApplication) => {
        toast({ title: "Info", description: "Edit functionality to be implemented on a separate page." });
    };

    const handleDelete = (id: string) => {
        setLeaves(leaves.filter(l => l.id !== id));
        toast({ title: "Deleted", description: "Leave application has been deleted.", variant: "destructive" });
    };

    const filteredAndSortedLeaves = React.useMemo(() => {
        let sortableItems = [...leaves];
        if (searchTerm) {
            const lowercasedFilter = searchTerm.toLowerCase();
            sortableItems = sortableItems.filter(leave =>
                leave.employeeName.toLowerCase().includes(lowercasedFilter) ||
                leave.department.toLowerCase().includes(lowercasedFilter) ||
                leave.status.toLowerCase().includes(lowercasedFilter)
            );
        }
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                let comparison = 0;
                if (aValue instanceof Date && bValue instanceof Date) {
                    comparison = aValue.getTime() - bValue.getTime();
                } else if (typeof aValue === 'string' && typeof bValue === 'string') {
                    comparison = aValue.localeCompare(bValue);
                }

                return sortConfig.direction === 'ascending' ? comparison : -comparison;
            });
        }
        return sortableItems;
    }, [leaves, searchTerm, sortConfig]);

     React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, rowsPerPage]);
    
    const totalPages = Math.ceil(filteredAndSortedLeaves.length / rowsPerPage);
    const paginatedLeaves = React.useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return filteredAndSortedLeaves.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredAndSortedLeaves, currentPage, rowsPerPage]);
    
    const requestSort = (key: keyof LeaveApplication) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof LeaveApplication) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <div className="w-4 h-4" />;
        }
        return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
    };

    const statusVariant = {
        "Pending": "secondary",
        "Approved": "default",
        "Rejected": "destructive",
    } as const;
    
    React.useEffect(() => {
      setRowSelection({});
    }, [paginatedLeaves]);
    
    const handleSelectAll = (checked: boolean) => {
        const newSelection: Record<string, boolean> = {};
        if (checked) {
            paginatedLeaves.forEach(leave => newSelection[leave.id] = true);
        }
        setRowSelection(newSelection);
    }
    
    const handleRowSelect = (id: string, checked: boolean) => {
        setRowSelection(prev => ({ ...prev, [id]: checked }));
    }
    
    const selectedRowCount = Object.values(rowSelection).filter(Boolean).length;
    const isAllOnPageSelected = selectedRowCount === paginatedLeaves.length && paginatedLeaves.length > 0;

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Leave Applications</CardTitle>
                <CardDescription>View, search, and manage all leave applications.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, dept, status..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 h-8"
                        />
                    </div>
                    <Button onClick={() => router.push('/dashboard/hr/leaves/add')} className="w-full sm:w-auto">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Apply for Leave
                    </Button>
                </div>
                <div className="border border-gray-300 rounded-sm">
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 border-b border-gray-300 text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Leave Records
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gray-200/50 dark:bg-gray-700/50">
                                <TableRow>
                                    <TableHead className="px-2 py-1 h-auto w-10 text-center">
                                        <Checkbox
                                            checked={isAllOnPageSelected}
                                            onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                                            aria-label="Select all"
                                        />
                                    </TableHead>
                                    {[
                                        { key: 'employeeId', label: 'Emp. ID' },
                                        { key: 'employeeName', label: 'Name' },
                                        { key: 'department', label: 'Department' },
                                        { key: 'leaveType', label: 'Leave Type' },
                                        { key: 'fromDate', label: 'From' },
                                        { key: 'toDate', label: 'To' },
                                        { key: 'status', label: 'Status' },
                                    ].map(col => (
                                        <TableHead key={col.key} className="px-2 h-auto">
                                            <Button variant="ghost" onClick={() => requestSort(col.key as keyof LeaveApplication)} className="px-2 py-1 h-auto text-xs">
                                                {col.label} {getSortIcon(col.key as keyof LeaveApplication)}
                                            </Button>
                                        </TableHead>
                                    ))}
                                    <TableHead className="px-2 h-auto text-xs font-semibold text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedLeaves.length > 0 ? (
                                    paginatedLeaves.map((leave, index) => (
                                        <TableRow key={leave.id} data-state={rowSelection[leave.id] && "selected"} className={cn("text-xs", index % 2 === 0 ? 'bg-white dark:bg-gray-900/50' : 'bg-gray-50 dark:bg-gray-800/50')}>
                                            <TableCell className="px-2 py-1 text-center">
                                                <Checkbox
                                                    checked={rowSelection[leave.id] || false}
                                                    onCheckedChange={(checked) => handleRowSelect(leave.id, Boolean(checked))}
                                                    aria-label="Select row"
                                                />
                                            </TableCell>
                                            <TableCell className="px-2 py-1">{leave.employeeId}</TableCell>
                                            <TableCell className="px-2 py-1 font-medium">{leave.employeeName}</TableCell>
                                            <TableCell className="px-2 py-1">{leave.department}</TableCell>
                                            <TableCell className="px-2 py-1">{leave.leaveType}</TableCell>
                                            <TableCell className="px-2 py-1">{format(leave.fromDate, "dd/MM/yy")}</TableCell>
                                            <TableCell className="px-2 py-1">{format(leave.toDate, "dd/MM/yy")}</TableCell>
                                            <TableCell className="px-2 py-1">
                                                <Badge variant={statusVariant[leave.status]} className="text-white text-[10px] px-1.5 py-0.5">{leave.status}</Badge>
                                            </TableCell>
                                            <TableCell className="px-2 py-1 text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(leave)} className="h-6 w-6">
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
                                                                This action cannot be undone. This will permanently delete the leave application for {leave.employeeName}.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(leave.id!)}>Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} className="h-24 text-center">No results found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                     <div className="flex items-center justify-between p-2 border-t border-gray-300 bg-gray-100 dark:bg-gray-800 text-xs">
                        <div className="flex-1 text-sm text-muted-foreground">
                            {selectedRowCount} of {paginatedLeaves.length} row(s) selected.
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Rows per page:</span>
                            <Select
                                value={`${rowsPerPage}`}
                                onValueChange={(value) => {
                                    setRowsPerPage(Number(value));
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
                        <div className="text-muted-foreground">
                            Page {totalPages > 0 ? currentPage : 0} of {totalPages}
                        </div>
                        <div className="flex items-center space-x-1">
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage >= totalPages}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                             <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => setCurrentPage(totalPages)} disabled={currentPage >= totalPages}>
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="text-muted-foreground">
                            Showing {paginatedLeaves.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-{Math.min(currentPage * rowsPerPage, filteredAndSortedLeaves.length)} of {filteredAndSortedLeaves.length}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
