
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
import { Edit, Trash, Eye } from "lucide-react";
import { VehicleStock } from "./schema";

interface DataTableRowActionsProps {
    row: Row<VehicleStock>;
}

export function DataTableRowActions({
    row,
}: DataTableRowActionsProps) {
    const { toast } = useToast();

    const handleAction = (action: string) => {
        toast({ title: "Action Triggered", description: `${action} on Chassis No: ${row.original.chassisNo}`});
    }

    const handleDelete = async () => {
        toast({ title: "Success", description: `Record for ${row.original.chassisNo} has been deleted.`, variant: "destructive" });
        // In a real app, you would call a server action here to delete the record.
    };

    return (
        <div className="flex gap-1">
             <Button variant="ghost" size="icon" onClick={() => handleAction('View')} className="h-6 w-6">
                <Eye className="h-3.5 w-3.5" />
            </Button>
             <Button variant="ghost" size="icon" onClick={() => handleAction('Edit')} className="h-6 w-6">
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
                            This will permanently delete the stock record with Chassis No "{row.original.chassisNo}".
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
