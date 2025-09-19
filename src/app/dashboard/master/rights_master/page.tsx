
"use client";

import { useState, useMemo } from "react";
import { PlusCircle, Edit, Trash, Search, ChevronUp, ChevronDown, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PermissionFormDialog } from "./permission-form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export type Permission = {
  id: string;
  branchName: string;
  userName: string;
  userRole: string;
  module: string;
  permissions: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    approve: boolean;
  };
  status: "Active" | "Inactive";
};

type SortConfig = { key: keyof Permission; direction: 'ascending' | 'descending' } | null;

const MOCK_PERMISSIONS: Permission[] = [
  { id: 'perm_1', branchName: 'Pune Kothrud', userName: 'Anjali Sharma', userRole: 'Manager', module: 'Sales', permissions: { view: true, create: true, edit: true, delete: false, approve: true }, status: 'Active' },
  { id: 'perm_2', branchName: 'Mumbai Andheri', userName: 'Vikram Singh', userRole: 'Sales Rep', module: 'Sales', permissions: { view: true, create: true, edit: false, delete: false, approve: false }, status: 'Active' },
  { id: 'perm_3', branchName: 'Pune Kothrud', userName: 'Ravi Mehra', userRole: 'Accountant', module: 'Accounts', permissions: { view: true, create: true, edit: true, delete: false, approve: false }, status: 'Active' },
  { id: 'perm_4', branchName: 'Pune Viman Nagar', userName: 'Suresh Patil', userRole: 'Admin', module: 'All', permissions: { view: true, create: true, edit: true, delete: true, approve: true }, status: 'Active' },
  { id: 'perm_5', branchName: 'Mumbai Andheri', userName: 'Priya Verma', userRole: 'Sales Rep', module: 'Sales', permissions: { view: true, create: true, edit: false, delete: false, approve: false }, status: 'Inactive' },
];

export default function RightsMasterPage() {
    const [permissions, setPermissions] = useState<Permission[]>(MOCK_PERMISSIONS);
    const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'branchName', direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});


    const filteredAndSortedPermissions = useMemo(() => {
        let items = [...permissions];

        if (searchTerm) {
            const lowercasedFilter = searchTerm.toLowerCase();
            items = items.filter(p =>
                p.branchName.toLowerCase().includes(lowercasedFilter) ||
                p.userName.toLowerCase().includes(lowercasedFilter) ||
                p.userRole.toLowerCase().includes(lowercasedFilter) ||
                p.module.toLowerCase().includes(lowercasedFilter)
            );
        }
        
        if (sortConfig !== null) {
            items.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        
        return items;
    }, [permissions, searchTerm, sortConfig]);

    const totalPages = Math.ceil(filteredAndSortedPermissions.length / rowsPerPage);
    const paginatedPermissions = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return filteredAndSortedPermissions.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredAndSortedPermissions, currentPage, rowsPerPage]);

    const requestSort = (key: keyof Permission) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof Permission) => {
        if (!sortConfig || sortConfig.key !== key) return <div className="w-4 h-4" />;
        return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
    };

    const handleEdit = (permission: Permission) => {
        setSelectedPermission(permission);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        setPermissions(prev => prev.filter(p => p.id !== id));
    };

    const handleSave = (permissionData: Omit<Permission, 'id' | 'module'> & {modules: string[]}) => {
        if (selectedPermission) {
            const { modules, ...rest } = permissionData;
            // When editing, we assume one module is being edited, even though the form supports more.
            // A more complex implementation would handle this differently.
            const updatedPermission = { ...rest, module: modules[0] || selectedPermission.module, id: selectedPermission.id };
            setPermissions(prev => prev.map(p => p.id === selectedPermission.id ? updatedPermission : p));
        }
    };
    
    const handleSelectAll = (checked: boolean) => {
        const newSelection: Record<string, boolean> = {};
        if (checked) {
            paginatedPermissions.forEach(p => newSelection[p.id] = true);
        }
        setRowSelection(newSelection);
    }

    const handleRowSelect = (id: string, checked: boolean) => {
        setRowSelection(prev => ({ ...prev, [id]: checked }));
    }
    
    const selectedRowCount = Object.values(rowSelection).filter(Boolean).length;
    const isAllOnPageSelected = selectedRowCount === paginatedPermissions.length && paginatedPermissions.length > 0;

    return (
        <>
            <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Manage User Permissions</CardTitle>
                            <CardDescription>
                                Assign and manage user permissions for different branches and modules.
                            </CardDescription>
                        </div>
                         <Button asChild className="w-full sm:w-auto">
                            <Link href="/dashboard/master/rights_master/assign-permissions">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Assign Permissions
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full sm:max-w-xs mb-4">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by branch, user, role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 h-8"
                        />
                    </div>
                    <div className="border border-gray-300 rounded-sm">
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 border-b border-gray-300 text-sm font-semibold text-gray-700 dark:text-gray-200">
                            Permission Records
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
                                        <TableHead className="px-2 h-auto text-xs"><Button variant="ghost" className="p-1 h-auto" onClick={() => requestSort('branchName')}>Branch {getSortIcon('branchName')}</Button></TableHead>
                                        <TableHead className="px-2 h-auto text-xs"><Button variant="ghost" className="p-1 h-auto" onClick={() => requestSort('userName')}>User (Role) {getSortIcon('userName')}</Button></TableHead>
                                        <TableHead className="px-2 h-auto text-xs"><Button variant="ghost" className="p-1 h-auto" onClick={() => requestSort('module')}>Module {getSortIcon('module')}</Button></TableHead>
                                        <TableHead className="px-2 h-auto text-xs">Permissions</TableHead>
                                        <TableHead className="px-2 h-auto text-xs"><Button variant="ghost" className="p-1 h-auto" onClick={() => requestSort('status')}>Status {getSortIcon('status')}</Button></TableHead>
                                        <TableHead className="px-2 h-auto text-xs text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedPermissions.length > 0 ? paginatedPermissions.map((p, index) => (
                                        <TableRow key={p.id} data-state={rowSelection[p.id] && "selected"} className={cn("text-xs", index % 2 === 0 ? 'bg-white dark:bg-gray-900/50' : 'bg-gray-50 dark:bg-gray-800/50')}>
                                            <TableCell className="px-2 py-1 text-center">
                                                <Checkbox
                                                    checked={rowSelection[p.id] || false}
                                                    onCheckedChange={(checked) => handleRowSelect(p.id, Boolean(checked))}
                                                    aria-label="Select row"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium p-2">{p.branchName}</TableCell>
                                            <TableCell className="p-2">{p.userName} <span className="text-muted-foreground">({p.userRole})</span></TableCell>
                                            <TableCell className="p-2">{p.module}</TableCell>
                                            <TableCell className="p-2 flex flex-wrap gap-1">
                                                {Object.entries(p.permissions).map(([key, value]) => value && <Badge key={key} variant="secondary" className="text-[10px] px-1.5 py-0.5">{key}</Badge>)}
                                            </TableCell>
                                            <TableCell className="p-2">
                                                <Badge variant={p.status === 'Active' ? 'default' : 'destructive'} className="text-white text-[10px] px-1.5 py-0.5">{p.status}</Badge>
                                            </TableCell>
                                            <TableCell className="p-2 text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(p)} className="h-6 w-6"><Edit className="h-3.5 w-3.5" /></Button>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-6 w-6" onClick={() => handleDelete(p.id)}><Trash className="h-3.5 w-3.5" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center h-24">No permissions found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-between p-2 border-t border-gray-300 bg-gray-100 dark:bg-gray-800 text-xs">
                             <div className="flex-1 text-sm text-muted-foreground">
                                {selectedRowCount} of {paginatedPermissions.length} row(s) selected on this page.
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
                                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button>
                                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage >= totalPages}><ChevronRight className="h-4 w-4" /></Button>
                                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => setCurrentPage(totalPages)} disabled={currentPage >= totalPages}><ChevronsRight className="h-4 w-4" /></Button>
                            </div>
                            <div className="text-muted-foreground">
                                Showing {paginatedPermissions.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
                                {Math.min(currentPage * rowsPerPage, filteredAndSortedPermissions.length)} of {filteredAndSortedPermissions.length}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <PermissionFormDialog
                isOpen={isFormOpen}
                setIsOpen={setIsFormOpen}
                permission={selectedPermission}
                onSave={handleSave}
            />
        </>
    );
}
