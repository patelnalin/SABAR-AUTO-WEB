
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
import { deleteBrand } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Edit, Save, Trash, X } from "lucide-react";
import { Brand } from "./columns";


interface DataTableRowActionsProps {
    row: Row<Brand>;
    editingRowId: string | null;
    editRow: (id: string) => void;
    cancelEdit: () => void;
    saveRow: (id: string) => void;
    deleteRow: (id: string) => void;
}

export function DataTableRowActions({
    row,
    editingRowId,
    editRow,
    cancelEdit,
    saveRow,
    deleteRow
}: DataTableRowActionsProps) {
    const { toast } = useToast();
    const isEditing = editingRowId === row.original.id;

    const handleDelete = async () => {
        const result = await deleteBrand(row.original.id);
        if (result.success) {
            toast({ title: "Success", description: result.message });
            deleteRow(row.original.id);
        } else {
            toast({ title: "Error", description: result.message, variant: "destructive" });
        }
    };

    if (isEditing) {
        return (
            <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => saveRow(row.original.id)} className="h-6 w-6">
                    <Save className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => cancelEdit()} className="h-6 w-6">
                    <X className="h-3.5 w-3.5" />
                </Button>
            </div>
        );
    }

    return (
        <div className="flex gap-1">
             <Button variant="ghost" size="icon" onClick={() => editRow(row.original.id)} className="h-6 w-6">
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
                            This will permanently delete the brand "{row.original.brandName}".
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
