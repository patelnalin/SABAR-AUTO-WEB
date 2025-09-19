
export type Invoice = {
    id: string;
    invoiceNumber: string;
    invoiceDate: Date;
    poNumber: string;
    grnNumber?: string;
    supplierName: string;
    status: "Draft" | "Pending Approval" | "Approved" | "Paid" | "Cancelled";
    grandTotal: number;
    createdBy: string;
    approvedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}

export const MOCK_INVOICES: Invoice[] = [
  {
    id: "inv-001",
    invoiceNumber: "INV-2024-07-001",
    invoiceDate: new Date("2024-07-10"),
    poNumber: "PO-2024-001",
    grnNumber: "GRN-001",
    supplierName: "Reliable Auto Parts",
    status: "Paid",
    grandTotal: 150000,
    createdBy: "Admin",
    approvedBy: "Manager",
    createdAt: new Date("2024-07-10"),
    updatedAt: new Date("2024-07-11"),
  },
  {
    id: "inv-002",
    invoiceNumber: "INV-2024-07-002",
    invoiceDate: new Date("2024-07-15"),
    poNumber: "PO-2024-002",
    supplierName: "Bharat Tyres",
    status: "Approved",
    grandTotal: 75000,
    createdBy: "Admin",
    approvedBy: "Manager",
    createdAt: new Date("2024-07-15"),
    updatedAt: new Date("2024-07-16"),
  },
  {
    id: "inv-003",
    invoiceNumber: "INV-2024-07-003",
    invoiceDate: new Date("2024-07-20"),
    poNumber: "PO-2024-003",
    supplierName: "Engine Masters",
    status: "Pending Approval",
    grandTotal: 320000,
    createdBy: "UserX",
    createdAt: new Date("2024-07-20"),
    updatedAt: new Date("2024-07-20"),
  },
    {
    id: "inv-004",
    invoiceNumber: "INV-2024-07-004",
    invoiceDate: new Date("2024-07-23"),
    poNumber: "PO-2024-006",
    grnNumber: "GRN-002",
    supplierName: "Deco Accessories",
    status: "Draft",
    grandTotal: 60000,
    createdBy: "UserZ",
    createdAt: new Date("2024-07-23"),
    updatedAt: new Date("2024-07-23"),
  },
  {
    id: "inv-005",
    invoiceNumber: "INV-2024-06-005",
    invoiceDate: new Date("2024-06-25"),
    poNumber: "PO-2024-005",
    supplierName: "Reliable Auto Parts",
    status: "Cancelled",
    grandTotal: 90000,
    createdBy: "Admin",
    createdAt: new Date("2024-06-25"),
    updatedAt: new Date("2024-06-26"),
  }
];
