
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import Link from "next/link";

const inventoryModules = [
]

export default function InventoryMasterPage() {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Inventory Master</CardTitle>
                <CardDescription>
                    Manage all inventory-related master data from one place.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {inventoryModules.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {inventoryModules.map(module => (
                            <Link key={module.name} href={module.href} className={module.status === 'Coming Soon' ? 'pointer-events-none' : ''}>
                                <Card className="h-full hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <Package className="w-6 h-6 text-primary" />
                                                <CardTitle className="text-lg">{module.name}</CardTitle>
                                            </div>
                                            {module.status === 'Coming Soon' && (
                                                <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{module.status}</span>
                                            )}
                                        </div>
                                        <CardDescription className="pt-2">{module.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-12">
                        <p>No inventory modules are currently available.</p>
                        <p className="text-sm">More modules will be added here soon.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
