import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Banknote, Users, Database } from 'lucide-react';

async function getVehicleData() {
  return [
    { id: "VEH-728ed52f", model: "Bajaj Pulsar NS200", status: "Sold", saleDate: "2023-10-15", customer: "Amit Patel" },
    { id: "VEH-489e1d42", model: "Bajaj Dominar 400", status: "In Stock", saleDate: null, customer: null },
    { id: "VEH-f8c3b54e", model: "Bajaj Chetak Electric", status: "Sold", saleDate: "2023-11-01", customer: "Priya Sharma" },
    { id: "VEH-a7b2c9d1", model: "Bajaj Avenger Cruise 220", status: "Booked", saleDate: null, customer: "Rajesh Kumar" },
    { id: "VEH-b3d5e8f6", model: "Bajaj Pulsar 150", status: "In Stock", saleDate: null, customer: null },
    { id: "VEH-c9e7f2a3", model: "Bajaj Platina 110", status: "Sold", saleDate: "2023-12-05", customer: "Sunita Devi" },
    { id: "VEH-d1a9b8c7", model: "Bajaj CT 110X", status: "In Stock", saleDate: null, customer: null },
    { id: "VEH-e6f4g5h3", model: "Bajaj Pulsar RS200", status: "Booked", saleDate: null, customer: "Vikram Singh" },
  ];
}

const kpiData = [
    { title: "Total Sales", value: "1,250", icon: Banknote, color: "bg-green-500" },
    { title: "Vehicles in Stock", value: "82", icon: Database, color: "bg-blue-500" },
    { title: "New Leads", value: "45", icon: Users, color: "bg-orange-500" },
    { title: "Open Service Requests", value: "12", icon: Briefcase, color: "bg-red-500" },
]

export default async function DashboardPage() {
  const data = await getVehicleData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back, Admin!</h1>
        <p className="text-muted-foreground">Here's a summary of your operations.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
            <Card key={kpi.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                    <kpi.icon className={`h-4 w-4 text-muted-foreground ${kpi.color.replace('bg-', 'text-')}`} />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                </CardContent>
            </Card>
        ))}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Vehicle Inventory & Sales</CardTitle>
          <CardDescription>An overview of all vehicles in your system.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </div>
  );
}
