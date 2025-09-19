
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
import { deleteFinancialYear } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash } from "lucide-react";
import { FinancialYear } from "./columns";
import { YearFormDialog } from "./year-form";


interface DataTableRowActionsProps {
    row: Row<FinancialYear>;
    deleteRow: (id: string) => void;
}

export function DataTableRowActions({
    row,
    deleteRow
}: DataTableRowActionsProps) {
    const { toast } = useToast();

    const handleDelete = async () => {
        const result = await deleteFinancialYear(row.original.id);
        if (result.success) {
            toast({ title: "Success", description: result.message });
            deleteRow(row.original.id);
        } else {
            toast({ title: "Error", description: result.message, variant: "destructive" });
        }
    };

    return (
        <div className="flex gap-1">
            <YearFormDialog
              year={row.original}
              trigger={<Button variant="ghost" size="icon" className="h-6 w-6"><Edit className="h-3.5 w-3.5" /></Button>}
            />
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
                            This will permanently delete the financial year "{row.original.yearName}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
