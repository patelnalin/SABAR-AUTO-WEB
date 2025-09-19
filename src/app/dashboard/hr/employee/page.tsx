

"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Edit, Trash, ChevronUp, ChevronDown, PlusCircle, Search, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, Eye } from "lucide-react";

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
import { useToast } from "@/hooks/use-toast";
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
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type Employee = {
  id: string; 
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: "HR" | "Sales" | "IT" | "Accounts" | "Marketing";
  jobTitle: string;
  joiningDate: Date;
  employmentStatus: "Active" | "On Leave" | "Resigned" | "Terminated";
};


const initialEmployees: Employee[] = [
    { id: '1', employeeId: 'EMP001', firstName: 'Aarav', lastName: 'Sharma', email: 'aarav.sharma@example.com', phone: '9876543210', department: 'IT', jobTitle: 'Software Engineer', joiningDate: new Date('2022-08-15'), employmentStatus: 'Active' },
    { id: '2', employeeId: 'EMP002', firstName: 'Diya', lastName: 'Patel', email: 'diya.patel@example.com', phone: '9123456780', department: 'Sales', jobTitle: 'Sales Manager', joiningDate: new Date('2021-05-20'), employmentStatus: 'Active' },
    { id: '3', employeeId: 'EMP003', firstName: 'Rohan', lastName: 'Gupta', email: 'rohan.gupta@example.com', phone: '9988776655', department: 'HR', jobTitle: 'HR Executive', joiningDate: new Date('2023-01-10'), employmentStatus: 'Active' },
    { id: '4', employeeId: 'EMP004', firstName: 'Priya', lastName: 'Singh', email: 'priya.singh@example.com', phone: '8877665544', department: 'Accounts', jobTitle: 'Accountant', joiningDate: new Date('2020-11-30'), employmentStatus: 'Resigned' },
    { id: '5', employeeId: 'EMP005', firstName: 'Vivaan', lastName: 'Joshi', email: 'vivaan.joshi@example.com', phone: '8765432109', department: 'IT', jobTitle: 'UI/UX Designer', joiningDate: new Date('2023-03-01'), employmentStatus: 'On Leave' },
    { id: '6', employeeId: 'EMP006', firstName: 'Anika', lastName: 'Reddy', email: 'anika.reddy@example.com', phone: '9012345678', department: 'Sales', jobTitle: 'Sales Executive', joiningDate: new Date('2022-11-01'), employmentStatus: 'Terminated' },
];

type SortConfig = {
    key: keyof Employee;
    direction: 'ascending' | 'descending';
} | null;

export default function EmployeeManagementPage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'joiningDate', direction: 'descending' });
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleEdit = useCallback((employee: Employee) => {
    toast({ title: "Info", description: `Editing for ${employee.firstName}. To be implemented.` });
    // In a real app, you would navigate to an edit page with the employee's ID
    // router.push(`/dashboard/hr/employee/edit/${employee.id}`);
  }, [toast]);

  const handleDelete = (id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    setRowSelection(prev => {
        const newSelection = {...prev};
        delete newSelection[id];
        return newSelection;
    });
    toast({ title: "Success", description: "Employee deleted successfully.", variant: "destructive" });
  };
  
  const filteredAndSortedEmployees = useMemo(() => {
    let sortableItems = [...employees];
    if (searchTerm) {
        const lowercasedFilter = searchTerm.toLowerCase();
        sortableItems = sortableItems.filter(employee =>
            `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(lowercasedFilter) ||
            employee.employeeId.toLowerCase().includes(lowercasedFilter) ||
            employee.email.toLowerCase().includes(lowercasedFilter) ||
            employee.department.toLowerCase().includes(lowercasedFilter) ||
            employee.jobTitle.toLowerCase().includes(lowercasedFilter)
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
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            comparison = aValue - bValue;
        }

        return sortConfig.direction === 'ascending' ? comparison : -comparison;
      });
    }
    return sortableItems;
  }, [employees, searchTerm, sortConfig]);
  
  const requestSort = (key: keyof Employee) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: keyof Employee) => {
    if (!sortConfig || sortConfig.key !== key) {
        return <div className="w-4 h-4" />;
    }
    return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const totalPages = Math.ceil(filteredAndSortedEmployees.length / rowsPerPage);
  const paginatedEmployees = useMemo(() => {
      const startIndex = (currentPage - 1) * rowsPerPage;
      return filteredAndSortedEmployees.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedEmployees, currentPage, rowsPerPage]);
  
  useEffect(() => {
    setRowSelection({});
  }, [paginatedEmployees]);

  useEffect(() => {
      setCurrentPage(1);
  }, [searchTerm, rowsPerPage]);
  
  const handleSelectAll = (checked: boolean) => {
      const newSelection: Record<string, boolean> = {};
      if (checked) {
          paginatedEmployees.forEach(emp => newSelection[emp.id] = true);
      }
      setRowSelection(newSelection);
  }

  const handleRowSelect = (id: string, checked: boolean) => {
      setRowSelection(prev => ({ ...prev, [id]: checked }));
  }
  
  const selectedRowCount = Object.values(rowSelection).filter(Boolean).length;
  const isAllOnPageSelected = selectedRowCount === paginatedEmployees.length && paginatedEmployees.length > 0;

  const statusVariant = {
    "Active": "default",
    "On Leave": "secondary",
    "Resigned": "outline",
    "Terminated": "destructive",
  } as const;

  return (
    <Card className="shadow-lg">
      <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                  <CardTitle>Employee Management</CardTitle>
                  <CardDescription>View, search, and manage all employees in the system.</CardDescription>
              </div>
              <Button onClick={() => router.push('/dashboard/hr/employee/add')} className="w-full sm:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Employee
              </Button>
          </div>
      </CardHeader>
      <CardContent>
          <div className="relative w-full sm:max-w-xs mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                  placeholder="Search by ID, name, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-8"
              />
          </div>
          <div className="border border-gray-300 rounded-sm">
            <div className="bg-gray-100 dark:bg-gray-800 p-2 border-b border-gray-300 text-sm font-semibold text-gray-700 dark:text-gray-200">
                Employee Records
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
                                { key: 'firstName', label: 'Name' },
                                { key: 'email', label: 'Email' },
                                { key: 'department', label: 'Department' },
                                { key: 'jobTitle', label: 'Job Title' },
                                { key: 'joiningDate', label: 'Joining Date' },
                                { key: 'employmentStatus', label: 'Status' },
                            ].map(col => (
                                <TableHead key={col.key} className="px-2 h-auto">
                                    <Button variant="ghost" onClick={() => requestSort(col.key as keyof Employee)} className="px-2 py-1 h-auto text-xs">
                                        {col.label} {getSortIcon(col.key as keyof Employee)}
                                    </Button>
                                </TableHead>
                            ))}
                            <TableHead className="px-2 h-auto text-xs font-semibold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedEmployees.length > 0 ? (
                            paginatedEmployees.map((employee, index) => (
                                <TableRow key={employee.id} data-state={rowSelection[employee.id] && "selected"} className={cn("text-xs", index % 2 === 0 ? 'bg-white dark:bg-gray-900/50' : 'bg-gray-50 dark:bg-gray-800/50')}>
                                     <TableCell className="px-2 py-1 text-center">
                                         <Checkbox
                                            checked={rowSelection[employee.id] || false}
                                            onCheckedChange={(checked) => handleRowSelect(employee.id, Boolean(checked))}
                                            aria-label="Select row"
                                        />
                                    </TableCell>
                                    <TableCell className="px-2 py-1">{employee.employeeId}</TableCell>
                                    <TableCell className="px-2 py-1 font-medium">{`${employee.firstName} ${employee.lastName}`}</TableCell>
                                    <TableCell className="px-2 py-1">{employee.email}</TableCell>
                                    <TableCell className="px-2 py-1">{employee.department}</TableCell>
                                    <TableCell className="px-2 py-1">{employee.jobTitle}</TableCell>
                                    <TableCell className="px-2 py-1">{format(employee.joiningDate, "dd/MM/yyyy")}</TableCell>
                                    <TableCell className="px-2 py-1">
                                        <Badge variant={statusVariant[employee.employmentStatus]} className="text-white text-[10px] px-1.5 py-0.5">{employee.employmentStatus}</Badge>
                                    </TableCell>
                                    <TableCell className="px-2 py-1 text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(employee)} className="h-6 w-6"><Edit className="h-3.5 w-3.5" /></Button>
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
                                                        This action cannot be undone. This will permanently delete the employee
                                                        "{`${employee.firstName} ${employee.lastName}`}".
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(employee.id!)}>Delete</AlertDialogAction>
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
                    {selectedRowCount} of {paginatedEmployees.length} row(s) selected.
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
                    Showing {paginatedEmployees.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-{Math.min(currentPage * rowsPerPage, filteredAndSortedEmployees.length)} of {filteredAndSortedEmployees.length}
                </div>
            </div>
          </div>
      </CardContent>
    </Card>
  );
}



    