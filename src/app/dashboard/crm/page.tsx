import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function CrmPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>CRM Dashboard</CardTitle>
                <CardDescription>Manage customer relationships, leads, and interactions.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>CRM module content goes here.</p>
            </CardContent>
        </Card>
    );
}
