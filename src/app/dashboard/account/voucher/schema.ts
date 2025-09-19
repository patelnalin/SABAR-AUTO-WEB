
import { z } from "zod";

export const voucherSchema = z.object({
  voucherNumber: z.string().min(1, "Voucher number is required."),
  voucherDate: z.date({ required_error: "Voucher date is required." }),
  voucherType: z.enum(["Payment", "Receipt", "Contra", "Journal"]),
  accountName: z.string().min(2, "Account name is required."),
  amount: z.coerce.number().min(0.01, "Amount must be greater than zero."),
  paymentMode: z.enum(["Cash", "Bank Transfer", "UPI", "Cheque"]).optional(),
  referenceNo: z.string().optional(),
  narration: z.string().min(5, "Narration is required."),
  status: z.enum(["Draft", "Posted", "Cancelled"]),
  approvedBy: z.string().optional(),
}).refine(data => {
    if ((data.voucherType === 'Payment' || data.voucherType === 'Receipt' || data.voucherType === 'Contra') && !data.paymentMode) {
        return false;
    }
    return true;
}, {
    message: "Payment mode is required for Payment, Receipt, or Contra vouchers.",
    path: ["paymentMode"],
});
