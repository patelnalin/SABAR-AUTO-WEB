
"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
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
import { Edit, Trash, MoreHorizontal, Eye, CheckCircle, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PurchaseOrder } from "./data";


interface DataTableRowActionsProps {
    row: Row<PurchaseOrder>;
    deleteRow: (id: string) => void;
}

export function DataTableRowActions({
    row,
    deleteRow
}: DataTableRowActionsProps) {
    const { toast } = useToast();
    const po = row.original;

    const handleAction = (action: string) => {
        toast({ title: "Action Triggered", description: `${action} on PO ${po.poNumber}`});
    }

    const handleDelete = async () => {
        toast({ title: "Success", description: `PO ${po.poNumber} has been deleted.`, variant: "destructive" });
        deleteRow(po.id);
    };

    return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleAction('View')}>
                <Eye className="mr-2 h-4 w-4" /> View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction('Edit')}>
                <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
             <DropdownMenuItem onClick={() => handleAction('Approve')}>
                <CheckCircle className="mr-2 h-4 w-4" /> Approve
            </DropdownMenuItem>
             <DropdownMenuItem onClick={() => handleAction('Cancel')}>
                <XCircle className="mr-2 h-4 w-4" /> Cancel
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive focus:text-destructive">
                        <Trash className="mr-2 h-4 w-4" /> Delete
                    </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the PO "{po.poNumber}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
    );
}
