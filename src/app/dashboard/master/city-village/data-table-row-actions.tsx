
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
import { deleteAddress } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash } from "lucide-react";
import { Address } from "./columns";


interface DataTableRowActionsProps {
    row: Row<Address>;
    deleteRow: (id: string) => void;
}

export function DataTableRowActions({
    row,
    deleteRow
}: DataTableRowActionsProps) {
    const { toast } = useToast();

    const handleEdit = () => {
        toast({ title: "Info", description: "Editing would be handled on a separate page, similar to the 'Add' flow."});
    }

    const handleDelete = async () => {
        const result = await deleteAddress(row.original.id);
        if (result.success) {
            toast({ title: "Success", description: result.message });
            deleteRow(row.original.id);
        } else {
            toast({ title: "Error", description: result.message, variant: "destructive" });
        }
    };

    return (
        <div className="flex gap-1">
             <Button variant="ghost" size="icon" onClick={handleEdit} className="h-6 w-6">
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
                            This will permanently delete the record for "{row.original.village}".
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
