
"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash, PlusCircle, Search, ChevronUp, ChevronDown, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";


type User = {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: 'Admin' | 'User' | 'Manager';
    status: boolean;
}

const initialUsers: User[] = [
    { id: 'usr_1', fullName: 'Admin User', email: 'admin@example.com', phoneNumber: '9876543210', role: 'Admin', status: true },
    { id: 'usr_2', fullName: 'Sales User', email: 'sales@example.com', phoneNumber: '9876543211', role: 'User', status: true },
    { id: 'usr_3', fullName: 'HR Manager', email: 'hr@example.com', phoneNumber: '9876543212', role: 'Manager', status: false },
    { id: 'usr_4', fullName: 'Vinay Kumar', email: 'vinay@example.com', phoneNumber: '9123456789', role: 'User', status: true },
    { id: 'usr_5', fullName: 'Anjali Desai', email: 'anjali@example.com', phoneNumber: '8877665544', role: 'Manager', status: true },
    { id: 'usr_6', fullName: 'Rohan Sharma', email: 'rohan@example.com', phoneNumber: '7766554433', role: 'User', status: false },
];

type SortConfig = { key: keyof User; direction: 'ascending' | 'descending' } | null;

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const { toast } = useToast();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'fullName', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const handleEdit = useCallback((user: User) => {
    toast({ title: "Info", description: `Editing for ${user.fullName} to be implemented.` });
  }, [toast]);

  const handleDelete = useCallback((userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    toast({ title: "Success", description: "User deleted successfully." });
  }, [toast]);

  const filteredAndSortedUsers = useMemo(() => {
    let sortableItems = [...users];
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      sortableItems = sortableItems.filter(user =>
        user.fullName.toLowerCase().includes(lowercasedFilter) ||
        user.email.toLowerCase().includes(lowercasedFilter) ||
        user.role.toLowerCase().includes(lowercasedFilter)
      );
    }
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        let comparison = 0;
        
        if(typeof aValue === 'boolean' && typeof bValue === 'boolean') {
            comparison = aValue === bValue ? 0 : aValue ? -1 : 1;
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
            comparison = aValue.localeCompare(bValue);
        }

        return sortConfig.direction === 'ascending' ? comparison : -comparison;
      });
    }
    return sortableItems;
  }, [users, searchTerm, sortConfig]);

  useEffect(() => {
      setCurrentPage(1);
      setRowSelection({});
  }, [searchTerm, rowsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / rowsPerPage);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredAndSortedUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedUsers, currentPage, rowsPerPage]);

  const requestSort = (key: keyof User) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof User) => {
    if (!sortConfig || sortConfig.key !== key) return <div className="w-4 h-4" />;
    return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelection: Record<string, boolean> = {};
    if (checked) {
      paginatedUsers.forEach(user => newSelection[user.id] = true);
    }
    setRowSelection(newSelection);
  }

  const handleRowSelect = (id: string, checked: boolean) => {
    setRowSelection(prev => ({...prev, [id]: checked}));
  }

  const selectedRowCount = Object.values(rowSelection).filter(Boolean).length;
  const isAllOnPageSelected = selectedRowCount === paginatedUsers.length && paginatedUsers.length > 0;

  const columns = [
    { key: 'id', label: 'User ID' },
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone Number' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div>
      <Card className="shadow-lg">
          <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>A list of all users in the system.</CardDescription>
                </div>
                <Button onClick={() => router.push('/dashboard/master/user/add')} className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New User
                </Button>
              </div>
          </CardHeader>
          <CardContent>
              <div className="relative w-full sm:max-w-xs mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                      placeholder="Search by name, email, role..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                      className="pl-8 h-8" 
                  />
              </div>
               <div className="border border-gray-300 rounded-sm">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 border-b border-gray-300 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    User Records
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
                                  {columns.map(col => (
                                      <TableHead key={col.key} className="px-2 h-auto">
                                          <Button variant="ghost" onClick={() => requestSort(col.key as keyof User)} className="px-1 py-1 h-auto text-xs">
                                              {col.label} {getSortIcon(col.key as keyof User)}
                                          </Button>
                                      </TableHead>
                                  ))}
                                  <TableHead className="px-2 h-auto text-xs font-semibold text-right">Actions</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {paginatedUsers.length > 0 ? (paginatedUsers.map((user, index) => (
                                  <TableRow key={user.id} data-state={rowSelection[user.id] && "selected"} className={cn("text-xs", index % 2 === 0 ? 'bg-white dark:bg-gray-900/50' : 'bg-gray-50 dark:bg-gray-800/50')}>
                                      <TableCell className="px-2 py-1 text-center">
                                        <Checkbox
                                            checked={rowSelection[user.id] || false}
                                            onCheckedChange={(checked) => handleRowSelect(user.id, Boolean(checked))}
                                            aria-label="Select row"
                                        />
                                      </TableCell>
                                      <TableCell className="px-2 py-1">{user.id}</TableCell>
                                      <TableCell className="px-2 py-1 font-medium">{user.fullName}</TableCell>
                                      <TableCell className="px-2 py-1">{user.email}</TableCell>
                                      <TableCell className="px-2 py-1">{user.phoneNumber}</TableCell>
                                      <TableCell className="px-2 py-1"><Badge variant={user.role === 'Admin' ? 'destructive' : 'secondary'} className="text-white">{user.role}</Badge></TableCell>
                                      <TableCell className="px-2 py-1"><Badge variant={user.status ? 'default' : 'outline'}>{user.status ? 'Active' : 'Inactive'}</Badge></TableCell>
                                      <TableCell className="px-2 py-1 text-right">
                                          <Button variant="ghost" size="icon" onClick={() => handleEdit(user)} className="h-6 w-6"><Edit className="h-3.5 w-3.5" /></Button>
                                          <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)} className="h-6 w-6 text-destructive"><Trash className="h-3.5 w-3.5" /></Button>
                                      </TableCell>
                                  </TableRow>
                              ))) : (
                                <TableRow>
                                  <TableCell colSpan={8} className="text-center h-24">No users found.</TableCell>
                                </TableRow>
                              )}
                          </TableBody>
                      </Table>
                  </div>
                   <div className="flex items-center justify-between p-2 border-t border-gray-300 bg-gray-100 dark:bg-gray-800 text-xs">
                        <div className="flex-1 text-sm text-muted-foreground">
                            {selectedRowCount} of {paginatedUsers.length} row(s) selected on this page.
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
                          Showing {paginatedUsers.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
                          {Math.min(currentPage * rowsPerPage, filteredAndSortedUsers.length)} of {filteredAndSortedUsers.length}
                      </div>
                  </div>
               </div>
          </CardContent>
      </Card>
    </div>
  );
}
