
import Link from "next/link";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  MenubarSeparator,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from "@/components/ui/menubar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Banknote,
  Users,
  Database,
  ScrollText,
  LayoutGrid,
  LogOut,
  Home,
  FileQuestion,
  ShoppingCart,
  Car,
  ShieldCheck,
  Receipt,
  MapPin,
  Building2,
  HeartPulse,
  Landmark,
  Package
} from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container flex items-center h-16 px-4 mx-auto max-w-screen-2xl sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-2 mr-6">
          <LayoutGrid className="w-6 h-6 text-primary" />
          <span className="hidden text-lg font-bold sm:inline-block">SABAR BAJAJ</span>
        </Link>
        
        <Menubar className="border-none shadow-none bg-transparent">
          <MenubarMenu>
            <Link href="/dashboard" className="flex items-center px-3 py-1.5 text-sm font-semibold">
              <Home className="w-4 h-4 mr-2" /> Dashboard
            </Link>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="font-semibold">
              <Briefcase className="w-4 h-4 mr-2" /> HR
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem asChild>
                <Link href="/dashboard/hr/employee">Employee</Link>
              </MenubarItem>
              <MenubarItem asChild>
                <Link href="/dashboard/hr/leaves">Leaves</Link>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="font-semibold">
              <Banknote className="w-4 h-4 mr-2" /> Account
            </MenubarTrigger>
            <MenubarContent>
                <MenubarSub>
                    <MenubarSubTrigger>
                         Sales
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                        <MenubarItem asChild><Link href="/dashboard/account/sales">Sales Dashboard</Link></MenubarItem>
                        <MenubarItem asChild><Link href="/dashboard/account/sales/enquiry">Enquiry</Link></MenubarItem>
                        <MenubarItem asChild><Link href="/dashboard/account/sales/saleschallan">Sales Challan</Link></MenubarItem>
                    </MenubarSubContent>
                </MenubarSub>
                 <MenubarSub>
                    <MenubarSubTrigger>
                         Purchase
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                        <MenubarItem asChild><Link href="/dashboard/account/purchase/purchase-order">Purchase Order</Link></MenubarItem>
                        <MenubarItem asChild><Link href="/dashboard/account/purchase/purchase-invoice">Purchase Invoice</Link></MenubarItem>
                        <MenubarItem asChild><Link href="/dashboard/account/purchase/grn">Purchase GRN</Link></MenubarItem>
                    </MenubarSubContent>
                </MenubarSub>
              <MenubarSeparator />
              <MenubarItem asChild><Link href="/dashboard/account/insurance">Insurance</Link></MenubarItem>
              <MenubarItem asChild><Link href="/dashboard/account/payment">Payment</Link></MenubarItem>
              <MenubarItem asChild><Link href="/dashboard/account/voucher">Voucher</Link></MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="font-semibold">
              <Users className="w-4 h-4 mr-2" /> CRM
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem asChild><Link href="/dashboard/crm">CRM Dashboard</Link></MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          
          <MenubarMenu>
            <MenubarTrigger className="font-semibold">
              <Database className="w-4 h-4 mr-2" /> Master
            </MenubarTrigger>
            <MenubarContent>
                <MenubarItem asChild><Link href="/dashboard/master/company">Company</Link></MenubarItem>
                <MenubarItem asChild><Link href="/dashboard/master/branch">Branch</Link></MenubarItem>
                <MenubarItem asChild><Link href="/dashboard/master/insurance-company">Insurance Company</Link></MenubarItem>
                <MenubarItem asChild><Link href="/dashboard/master/finance">Finance Company</Link></MenubarItem>
                <MenubarItem asChild><Link href="/dashboard/master/city-village">City/Village</Link></MenubarItem>
                 <MenubarSub>
                    <MenubarSubTrigger>
                         Vehicle Master
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                        <MenubarItem asChild><Link href="/dashboard/master/vehicle/brand">Brand</Link></MenubarItem>
                        <MenubarItem asChild><Link href="/dashboard/master/vehicle/model">Model</Link></MenubarItem>
                        <MenubarItem asChild><Link href="/dashboard/master/vehicle/color">Color</Link></MenubarItem>
                    </MenubarSubContent>
                </MenubarSub>
                <MenubarItem asChild><Link href="/dashboard/master/supplier">Supplier</Link></MenubarItem>
                <MenubarItem asChild><Link href="/dashboard/master/user">User</Link></MenubarItem>
                <MenubarItem asChild><Link href="/dashboard/master/rights_master">Rights Master</Link></MenubarItem>
                <MenubarItem asChild><Link href="/dashboard/master/year">Year</Link></MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="font-semibold">
              <ScrollText className="w-4 h-4 mr-2" /> Reports
            </MenubarTrigger>
            <MenubarContent>
                <MenubarItem asChild><Link href="/dashboard/reports/sales">Sales Report</Link></MenubarItem>
                <MenubarItem asChild><Link href="/dashboard/reports/finance">Finance Report</Link></MenubarItem>
                <MenubarItem asChild><Link href="/dashboard/reports/inventory/stock">Stock Report</Link></MenubarItem>
                <MenubarItem asChild><Link href="/dashboard/reports/year">Year Report</Link></MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        <div className="flex items-center ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative w-8 h-8 rounded-full">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://picsum.photos/100/100" alt="Admin" data-ai-hint="person face" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
