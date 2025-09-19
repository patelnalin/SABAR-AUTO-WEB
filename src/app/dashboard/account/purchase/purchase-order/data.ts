
export type PurchaseOrder = {
    id: string;
    poNumber: string;
    poDate: Date;
    branch: string;
    supplierName: string;
    invoiceNo?: string;
    invoiceDate?: Date;
    status: "Draft" | "Pending Approval" | "Approved" | "Partially Received" | "Completed" | "Cancelled";
    deliveryDate: Date;
    receivedDate?: Date;
    godown: string;
    transporter?: string;
    truckNo?: string;
    lrNo?: string;
    grandTotal: number;
    createdBy: string;
    approvedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: "po-001",
    poNumber: "PO-2024-001",
    poDate: new Date("2024-07-01"),
    branch: "Pune Kothrud",
    supplierName: "Reliable Auto Parts",
    invoiceNo: "INV-R-001",
    invoiceDate: new Date("2024-07-01"),
    status: "Completed",
    deliveryDate: new Date("2024-07-10"),
    receivedDate: new Date("2024-07-09"),
    godown: "Main Warehouse",
    transporter: "Speedy Logistics",
    truckNo: "MH12AB1234",
    lrNo: "LRN56789",
    grandTotal: 150000,
    createdBy: "Admin",
    approvedBy: "Manager",
    createdAt: new Date("2024-07-01"),
    updatedAt: new Date("2024-07-09"),
  },
  {
    id: "po-002",
    poNumber: "PO-2024-002",
    poDate: new Date("2024-07-05"),
    branch: "Mumbai Andheri",
    supplierName: "Bharat Tyres",
    invoiceNo: "INV-B-001",
    invoiceDate: new Date("2024-07-06"),
    status: "Approved",
    deliveryDate: new Date("2024-07-15"),
    godown: "Warehouse B",
    transporter: "Safe Transports",
    grandTotal: 75000,
    createdBy: "Admin",
    approvedBy: "Manager",
    createdAt: new Date("2024-07-05"),
    updatedAt: new Date("2024-07-06"),
  },
  {
    id: "po-003",
    poNumber: "PO-2024-003",
    poDate: new Date("2024-07-10"),
    branch: "Pune Kothrud",
    supplierName: "Engine Masters",
    status: "Pending Approval",
    deliveryDate: new Date("2024-07-20"),
    godown: "Main Warehouse",
    grandTotal: 320000,
    createdBy: "UserX",
    createdAt: new Date("2024-07-10"),
    updatedAt: new Date("2024-07-10"),
  },
  {
    id: "po-004",
    poNumber: "PO-2024-004",
    poDate: new Date("2024-07-12"),
    branch: "Pune Viman Nagar",
    supplierName: "Premium Oils Ltd.",
    status: "Draft",
    deliveryDate: new Date("2024-07-25"),
    godown: "Warehouse C",
    grandTotal: 45000,
    createdBy: "UserY",
    createdAt: new Date("2024-07-12"),
    updatedAt: new Date("2024-07-12"),
  },
  {
    id: "po-005",
    poNumber: "PO-2024-005",
    poDate: new Date("2024-06-20"),
    branch: "Mumbai Andheri",
    supplierName: "Reliable Auto Parts",
    status: "Cancelled",
    deliveryDate: new Date("2024-06-30"),
    godown: "Main Warehouse",
    grandTotal: 90000,
    createdBy: "Admin",
    approvedBy: "Manager",
    createdAt: new Date("2024-06-20"),
    updatedAt: new Date("2024-06-22"),
  },
  {
    id: "po-006",
    poNumber: "PO-2024-006",
    poDate: new Date("2024-07-15"),
    branch: "Pune Kothrud",
    supplierName: "Deco Accessories",
    status: "Partially Received",
    deliveryDate: new Date("2024-07-22"),
    receivedDate: new Date("2024-07-23"),
    godown: "Warehouse B",
    transporter: "QuickShip",
    truckNo: "GJ01CD5678",
    lrNo: "LRN12345",
    grandTotal: 60000,
    createdBy: "UserZ",
    approvedBy: "Manager",
    createdAt: new Date("2024-07-15"),
    updatedAt: new Date("2024-07-23"),
  }
];
