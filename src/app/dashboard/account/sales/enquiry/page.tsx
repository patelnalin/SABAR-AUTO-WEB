
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { 
    Edit, 
    Trash, 
    ChevronUp, 
    ChevronDown, 
    PlusCircle, 
    Search, 
    ChevronsLeft, 
    ChevronsRight, 
    ChevronLeft, 
    ChevronRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";


type Enquiry = {
    id: string;
    enquiryDate: Date;
    customerName: string;
    contactNumber: string;
    email?: string;
    vehicleBrand: string;
    vehicleModel: string;
    variantTrim?: string;
    fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid";
    transmission: "Manual" | "Automatic";
    salesExecutive: string;
    status: "New" | "In Progress" | "Converted" | "Closed" | "Lost";
    followUpDate?: Date;
    notes?: string;
    loanRequirement: boolean;
};

const initialEnquiries: Enquiry[] = [
    { id: 'enq-001', enquiryDate: new Date('2024-07-25'), customerName: 'Rajesh Kumar', contactNumber: '9876543210', email: 'rajesh.k@example.com', vehicleBrand: 'Bajaj', vehicleModel: 'RE', variantTrim: 'Auto DX', fuelType: 'Diesel', transmission: 'Manual', salesExecutive: 'Anjali Sharma', status: 'Converted', followUpDate: new Date('2024-07-30'), notes: 'Finalized deal, pending payment.', loanRequirement: true },
    { id: 'enq-002', enquiryDate: new Date('2024-07-24'), customerName: 'Sunita Devi', contactNumber: '9123456789', email: 'sunita.d@example.com', vehicleBrand: 'Bajaj', vehicleModel: 'Maxima C', variantTrim: 'Cargo', fuelType: 'Petrol', transmission: 'Manual', salesExecutive: 'Vikram Singh', status: 'In Progress', followUpDate: new Date('2024-08-02'), notes: 'Test drive scheduled.', loanRequirement: false },
    { id: 'enq-003', enquiryDate: new Date('2024-07-22'), customerName: 'Amit Patel', contactNumber: '8877665544', email: 'amit.p@example.com', vehicleBrand: 'Bajaj', vehicleModel: 'Qute', variantTrim: 'RE60', fuelType: 'Petrol', transmission: 'Automatic', salesExecutive: 'Anjali Sharma', status: 'New', loanRequirement: true },
    { id: 'enq-004', enquiryDate: new Date('2024-07-20'), customerName: 'Priya Verma', contactNumber: '7766554433', email: 'priya.v@example.com', vehicleBrand: 'Bajaj', vehicleModel: 'RE Electric', variantTrim: 'E-TEC 9.0', fuelType: 'Electric', transmission: 'Automatic', salesExecutive: 'Ravi Mehra', status: 'Lost', notes: 'Budget issue.', loanRequirement: false },
    { id: 'enq-005', enquiryDate: new Date('2024-07-18'), customerName: 'Manoj Singh', contactNumber: '8989898989', vehicleBrand: 'Bajaj', vehicleModel: 'RE', variantTrim: 'Auto LPG', fuelType: 'Hybrid', transmission: 'Manual', salesExecutive: 'Vikram Singh', status: 'Closed', notes: 'Decided not to purchase.', loanRequirement: false },
];


type SortConfig = { key: keyof Enquiry; direction: 'ascending' | 'descending' } | null;

export default function SalesEnquiryPage() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'enquiryDate', direction: 'descending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
    const router = useRouter();

    const { toast } = useToast();

    const filteredAndSortedEnquiries = useMemo(() => {
        let sortableItems = [...enquiries];
        if (searchTerm) {
            sortableItems = sortableItems.filter(enq =>
                enq.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                enq.contactNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                enq.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                enq.status.toLowerCase().includes(searchTerm.toLowerCase())
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
                } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
                    comparison = aValue === bValue ? 0 : (aValue ? -1 : 1);
                } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                    comparison = aValue - bValue;
                }
                
                return sortConfig.direction === 'ascending' ? comparison : -comparison;
            });
        }
        return sortableItems;
    }, [enquiries, searchTerm, sortConfig]);

    useEffect(() => {
        setCurrentPage(1);
        setRowSelection({});
    }, [searchTerm, rowsPerPage, sortConfig]);

    const totalPages = Math.ceil(filteredAndSortedEnquiries.length / rowsPerPage);
    const paginatedEnquiries = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return filteredAndSortedEnquiries.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredAndSortedEnquiries, currentPage, rowsPerPage]);
    
    useEffect(() => {
        setRowSelection({});
    }, [currentPage, paginatedEnquiries]);

    const handleEdit = useCallback((enquiry: Enquiry) => {
        // In a real app, you would navigate to an edit page.
        // For now, we'll just show a toast.
        toast({ title: "Info", description: `Editing for ${enquiry.customerName} to be implemented.` });
    }, [toast]);

    const handleDelete = (id: string) => {
        setEnquiries(enquiries.filter(enq => enq.id !== id));
        toast({ title: "Success", description: "Enquiry deleted successfully.", variant: "destructive" });
    };

    const requestSort = (key: keyof Enquiry) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof Enquiry) => {
        if (!sortConfig || sortConfig.key !== key) return <div className="w-4 h-4" />;
        return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
    };
    
    const handleSelectAll = (checked: boolean) => {
        const newSelection: Record<string, boolean> = {};
        if (checked) {
            paginatedEnquiries.forEach(enq => newSelection[enq.id] = true);
        }
        setRowSelection(newSelection);
    }

    const handleRowSelect = (id: string, checked: boolean) => {
        setRowSelection(prev => ({ ...prev, [id]: checked }));
    }
    
    const selectedRowCount = Object.values(rowSelection).filter(Boolean).length;
    const isAllOnPageSelected = selectedRowCount === paginatedEnquiries.length && paginatedEnquiries.length > 0;

    const statusVariant = {
        "New": "secondary",
        "In Progress": "default",
        "Converted": "outline",
        "Closed": "destructive",
        "Lost": "destructive",
    } as const;

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle>Sales Enquiry List</CardTitle>
                        <CardDescription>Search, sort, and manage all sales enquiries.</CardDescription>
                    </div>
                     <Button onClick={() => router.push('/dashboard/account/sales/enquiry/add')} className="w-full sm:w-auto">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Enquiry
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative w-full sm:max-w-xs mb-4">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search name, mobile, model..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8" />
                </div>
                 <div className="border border-gray-300 rounded-sm">
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 border-b border-gray-300 text-sm font-semibold text-gray-700 dark:text-gray-200">Enquiry Records</div>
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
                                        { key: 'id', label: 'Enq. ID' },
                                        { key: 'enquiryDate', label: 'Enq. Date' },
                                        { key: 'customerName', label: 'Customer' },
                                        { key: 'contactNumber', label: 'Contact' },
                                        { key: 'vehicleModel', label: 'Model' },
                                        { key: 'salesExecutive', label: 'Assigned To' },
                                        { key: 'status', label: 'Status' },
                                        { key: 'followUpDate', label: 'Follow Up' },
                                        { key: 'loanRequirement', label: 'Loan?' },
                                    ].map(col => (
                                        <TableHead key={col.key} className="px-2 h-auto"><Button variant="ghost" onClick={() => requestSort(col.key as keyof Enquiry)} className="px-2 py-1 h-auto text-xs">{col.label} {getSortIcon(col.key as keyof Enquiry)}</Button></TableHead>
                                    ))}
                                    <TableHead className="px-2 h-auto text-xs font-semibold text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedEnquiries.length > 0 ? (
                                    paginatedEnquiries.map((enq, index) => (
                                        <TableRow key={enq.id} data-state={rowSelection[enq.id] && "selected"} className={cn("text-xs", index % 2 === 0 ? 'bg-white dark:bg-gray-900/50' : 'bg-gray-50 dark:bg-gray-800/50')}>
                                            <TableCell className="px-2 py-1 text-center">
                                                <Checkbox
                                                    checked={rowSelection[enq.id] || false}
                                                    onCheckedChange={(checked) => handleRowSelect(enq.id, Boolean(checked))}
                                                    aria-label="Select row"
                                                />
                                            </TableCell>
                                            <TableCell className="px-2 py-1 uppercase">{enq.id}</TableCell>
                                            <TableCell className="px-2 py-1">{format(enq.enquiryDate, "dd/MM/yyyy")}</TableCell>
                                            <TableCell className="px-2 py-1 font-medium">{enq.customerName}</TableCell>
                                            <TableCell className="px-2 py-1">{enq.contactNumber}</TableCell>
                                            <TableCell className="px-2 py-1">{`${enq.vehicleBrand} ${enq.vehicleModel} ${enq.variantTrim || ''}`}</TableCell>
                                            <TableCell className="px-2 py-1">{enq.salesExecutive}</TableCell>
                                            <TableCell className="px-2 py-1"><Badge variant={statusVariant[enq.status]} className="text-white text-[10px] px-1.5 py-0.5">{enq.status}</Badge></TableCell>
                                            <TableCell className="px-2 py-1">{enq.followUpDate ? format(enq.followUpDate, "dd/MM/yyyy") : 'N/A'}</TableCell>
                                            <TableCell className="px-2 py-1">{enq.loanRequirement ? 'Yes' : 'No'}</TableCell>
                                            <TableCell className="px-2 py-1 text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(enq)} className="h-6 w-6"><Edit className="h-3.5 w-3.5" /></Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-6 w-6"><Trash className="h-3.5 w-3.5" /></Button></AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the enquiry for "{enq.customerName}".</AlertDialogDescription></AlertDialogHeader>
                                                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(enq.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow><TableCell colSpan={11} className="h-24 text-center">No enquiries found.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex items-center justify-between p-2 border-t border-gray-300 bg-gray-100 dark:bg-gray-800 text-xs">
                        <div className="flex-1 text-sm text-muted-foreground">
                            {selectedRowCount} of {paginatedEnquiries.length} row(s) selected on this page.
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
                        <div className="text-muted-foreground">Page {totalPages > 0 ? currentPage : 0} of {totalPages}</div>
                        <div className="flex items-center space-x-1">
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button>
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage >= totalPages}><ChevronRight className="h-4 w-4" /></Button>
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => setCurrentPage(totalPages)} disabled={currentPage >= totalPages}><ChevronsRight className="h-4 w-4" /></Button>
                        </div>
                        <div className="text-muted-foreground">
                            Showing {paginatedEnquiries.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
                            {Math.min(currentPage * rowsPerPage, filteredAndSortedEnquiries.length)} of {filteredAndSortedEnquiries.length}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
