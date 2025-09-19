
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { columns, InsurancePolicy } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function InsurancePage() {
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await fetch('/api/account/insurance');
        if (response.ok) {
          const data = await response.json();
          setPolicies(data);
        } else {
          console.error("Failed to fetch policies");
        }
      } catch (error) {
        console.error("Error fetching policies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Insurance Policy Management</CardTitle>
            <CardDescription>
              Track, manage, and process all insurance policies.
            </CardDescription>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/account/insurance/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Policy
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <DataTable columns={columns} data={policies} />
        )}
      </CardContent>
    </Card>
  );
}
