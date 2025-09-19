
export type GRN = {
    id: string;
    grnNo: string;
    grnDate: Date;
    poNo: string;
    branch: string;
    supplierName: string;
    invoiceNo: string;
    invoiceDate: Date;
    qty: number;
    amount: number;
    status: "Draft" | "Approved";
};

export const MOCK_GRN_DATA: GRN[] = [
  {
    id: "grn-001",
    grnNo: "GRN-2024-001",
    grnDate: new Date("2025-09-10"),
    poNo: "PO-2024-001",
    branch: "Pune Kothrud",
    supplierName: "Reliable Auto Parts",
    invoiceNo: "INV-R-001",
    invoiceDate: new Date("2025-09-11"),
    qty: 15,
    amount: 3425376.00,
    status: "Approved",
  },
  {
    id: "grn-002",
    grnNo: "GRN-2024-002",
    grnDate: new Date("2024-07-23"),
    poNo: "PO-2024-002",
    branch: "Mumbai Andheri",
    supplierName: "Deco Accessories",
    invoiceNo: "INV-2024-07-004",
    invoiceDate: new Date("2024-07-22"),
    qty: 1,
    amount: 110000.00,
    status: "Draft",
  },
];

export const MOCK_PO_DETAILS = [
    {
        poNumber: "PO-2024-001",
        branch: "Pune Kothrud",
        supplierName: "Reliable Auto Parts",
        invoiceNo: "INV-R-001",
        invoiceDate: new Date("2025-09-11"),
        truckNo: "MH12AB1234",
        lrNo: "LRN56789",
        items: [
            { modelCode: 'BJ-PNS200', modelName: 'Pulsar NS200', hsnCode: '8711', color: 'Racing Red', chassisNo: 'CHNS200R001', engineNo: 'ENNS200R001', rate: 140000, qty: 1, discount: 5000, igst: 0, amount: 0 },
            { modelCode: 'BJ-D400', modelName: 'Dominar 400', hsnCode: '8711', color: 'Stealth Black', chassisNo: 'CHD400G001', engineNo: 'END400G001', rate: 230000, qty: 1, discount: 10000, igst: 0, amount: 0 },
        ]
    },
    {
        poNumber: "PO-2024-002",
        branch: "Mumbai Andheri",
        supplierName: "Bharat Tyres",
        invoiceNo: "INV-B-001",
        invoiceDate: new Date("2024-07-06"),
        truckNo: "MH02CD5678",
        lrNo: "LRN12345",
        items: [
            { modelCode: 'BJ-CETAK', modelName: 'Chetak Electric', hsnCode: '8711', color: 'Pearl White', chassisNo: 'CHCETAKW001', engineNo: 'ENCETAKW001', rate: 150000, qty: 1, discount: 0, igst: 0, amount: 0 },
        ]
    },
    {
        poNumber: "PO-2024-003",
        branch: "Pune Kothrud",
        supplierName: "Engine Masters",
        invoiceNo: "INV-EM-001",
        invoiceDate: new Date("2024-07-12"),
        truckNo: "",
        lrNo: "",
        items: [
            { modelCode: 'BJ-PNS200', modelName: 'Pulsar NS200', hsnCode: '8711', color: 'Cosmic Blue', chassisNo: '', engineNo: '', rate: 142000, qty: 12, discount: 2000, igst: 0, amount: 0 },
        ]
    }
];
