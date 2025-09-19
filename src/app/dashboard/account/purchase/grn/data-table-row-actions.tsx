
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
import { Edit, Trash, MoreHorizontal, Eye, Printer, FileCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GRN } from "./data";

interface DataTableRowActionsProps {
    row: Row<GRN>;
}

export function DataTableRowActions({
    row,
}: DataTableRowActionsProps) {
    const { toast } = useToast();
    const grn = row.original;

    const handleAction = (action: string) => {
        toast({ title: "Action Triggered", description: `${action} on GRN ${grn.grnNumber}`});
    }

    const handleDelete = async () => {
        toast({ title: "Success", description: `GRN ${grn.grnNumber} has been deleted.`, variant: "destructive" });
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
             <DropdownMenuItem onClick={() => handleAction('Print')}>
                <Printer className="mr-2 h-4 w-4" /> Print
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction('Edit')}>
                <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
             <DropdownMenuItem onClick={() => handleAction('Approve')}>
                <FileCheck className="mr-2 h-4 w-4" /> Approve
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
                            This will permanently delete the GRN "{grn.grnNumber}".
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
