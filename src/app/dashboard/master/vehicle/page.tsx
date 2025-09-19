
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car } from "lucide-react";
import Link from "next/link";

const vehicleModules = [
    { name: "Brand Management", href: "/dashboard/master/vehicle/brand", description: "Manage vehicle brands.", status: "Active" },
    { name: "Model Management", href: "/dashboard/master/vehicle/model", description: "Manage vehicle models.", status: "Active" },
    { name: "Color Management", href: "/dashboard/master/vehicle/color", description: "Manage vehicle colors.", status: "Active" },
]

export default function VehicleMasterPage() {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Vehicle Master</CardTitle>
                <CardDescription>
                    Manage all vehicle-related master data from one place.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {vehicleModules.map(module => (
                        <Link key={module.name} href={module.href} className={module.status === 'Coming Soon' ? 'pointer-events-none' : ''}>
                            <Card className="h-full hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            
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
            </CardContent>
        </Card>
    );
}
