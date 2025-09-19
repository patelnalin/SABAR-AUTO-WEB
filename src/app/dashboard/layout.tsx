
import Header from "@/components/layout/header";
import Breadcrumbs from "@/components/layout/breadcrumbs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 w-full py-1 px-5 mx-auto max-w-7xl">
        <Breadcrumbs />
        {children}
      </main>
    </div>
  );
}
