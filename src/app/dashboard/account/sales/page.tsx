import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function SalesPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sales Management</CardTitle>
                <CardDescription>Track and manage vehicle sales.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Sales module content goes here.</p>
            </CardContent>
        </Card>
    );
}
