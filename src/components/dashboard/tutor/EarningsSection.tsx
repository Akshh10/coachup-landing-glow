
import React from "react";
import { DollarSign, TrendingUp, ArrowUpRight, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EarningsSummary {
  currentMonth: number;
  lastMonth: number;
  totalEarnings: number;
  pendingPayout: number;
  recentTransactions: {
    id: string;
    date: string;
    studentName: string;
    amount: number;
    status: "completed" | "pending";
  }[];
}

interface EarningsSectionProps {
  earnings: EarningsSummary;
}

const EarningsSection: React.FC<EarningsSectionProps> = ({ earnings }) => {
  const percentChange = earnings.lastMonth > 0 
    ? (((earnings.currentMonth - earnings.lastMonth) / earnings.lastMonth) * 100).toFixed(1)
    : "0";
  
  const isPositiveChange = earnings.currentMonth >= earnings.lastMonth;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Earnings</CardTitle>
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" /> Financial Reports
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-gray-500">Current Month</h4>
              {isPositiveChange && percentChange !== "0" && (
                <div className="flex items-center text-green-600 text-xs">
                  <TrendingUp className="mr-1 h-3 w-3" /> {percentChange}%
                </div>
              )}
              {!isPositiveChange && percentChange !== "0" && (
                <div className="flex items-center text-red-600 text-xs">
                  <TrendingUp className="mr-1 h-3 w-3 transform rotate-180" /> {percentChange.replace('-', '')}%
                </div>
              )}
            </div>
            <div className="flex items-center mt-2">
              <DollarSign className="text-primary h-6 w-6" />
              <span className="text-2xl font-bold">{earnings.currentMonth.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h4 className="text-gray-500">Total Earnings</h4>
            <div className="flex items-center mt-2">
              <DollarSign className="text-primary h-6 w-6" />
              <span className="text-2xl font-bold">{earnings.totalEarnings.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h4 className="text-gray-500">Pending Payout</h4>
            <div className="flex items-center mt-2">
              <DollarSign className="text-primary h-6 w-6" />
              <span className="text-2xl font-bold">{earnings.pendingPayout.toFixed(2)}</span>
            </div>
            {earnings.pendingPayout > 0 && (
              <Button size="sm" className="mt-2">Request Payout</Button>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">Recent Transactions</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {earnings.recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{transaction.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{transaction.studentName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">${transaction.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {transaction.status === "completed" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                
                {earnings.recentTransactions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                      No transactions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {earnings.recentTransactions.length > 0 && (
            <div className="mt-4 text-right">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary-foreground hover:bg-primary">
                View All Transactions <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EarningsSection;
