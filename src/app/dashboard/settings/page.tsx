
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
    return (
        <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your application settings and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Application settings will be available here.</p>
            </CardContent>
        </Card>
    );
}
