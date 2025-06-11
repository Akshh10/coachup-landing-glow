import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FinancialReportsModalProps {
  open: boolean;
  onClose: () => void;
  transactions: {
    id: string;
    date: string;
    studentName: string;
    amount: number;
    status: string;
  }[];
}

const FinancialReportsModal: React.FC<FinancialReportsModalProps> = ({ open, onClose, transactions }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Full Earnings History</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto max-h-[400px] mt-4">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-left text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Student</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50 text-sm">
                  <td className="px-4 py-2">{txn.date}</td>
                  <td className="px-4 py-2">{txn.studentName}</td>
                  <td className="px-4 py-2">${txn.amount.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <span className={`text-xs font-semibold rounded-full px-2 py-1 ${txn.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">No transactions yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FinancialReportsModal;