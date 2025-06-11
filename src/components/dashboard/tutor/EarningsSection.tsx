import React, { useEffect, useState } from "react";
import { DollarSign, TrendingUp, ArrowUpRight, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import FinancialReportsModal from "./FinancialReportsModal";
import { useUser } from "@/hooks/useUser";

interface EarningsSectionProps {
  earnings: {
    currentMonth: number;
    lastMonth: number;
    totalEarnings: number;
    pendingPayout: number;
    recentTransactions: any[];
  };
}

const EarningsSection: React.FC<EarningsSectionProps> = ({ earnings }) => {
  const { user } = useUser();
  const [showReports ,setshowReports]= useState(false);
  const [earningsState, setEarningsState] = useState({
    currentMonth: 0,
    lastMonth: 0,
    totalEarnings: 0,
    pendingPayout: 0,
    recentTransactions: [] as {
      id: string;
      date: string;
      studentName: string;
      amount: number;
      status: string;
    }[],
  });

  useEffect(() => {
    if (!user?.id) return;

    const loadEarnings = async () => {
      const now = new Date();
      const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();

      // Fetch current month earnings
      const { data: currentMonthData } = await supabase
        .from("sessions")
        .select("amount")
        .eq("tutor_id", user.id)
        .eq("status", "completed")
        .gte("start_time", startOfCurrentMonth);

      // Fetch last month earnings
      const { data: lastMonthData } = await supabase
        .from("sessions")
        .select("amount")
        .eq("tutor_id", user.id)
        .eq("status", "completed")
        .gte("start_time", startOfLastMonth)
        .lte("start_time", endOfLastMonth);

      // Fetch all-time earnings
      const { data: totalData } = await supabase
        .from("sessions")
        .select("amount")
        .eq("tutor_id", user.id)
        .eq("status", "completed");

      // Fetch pending payouts
      const { data: pendingData } = await supabase
        .from("sessions")
        .select("amount")
        .eq("tutor_id", user.id)
        .eq("status", "pending");

      // Fetch recent completed sessions
      const { data: recentData } = await supabase
        .from("sessions")
        .select("id, start_time, amount, student_id, status")
        .eq("tutor_id", user.id)
        .order("start_time", { ascending: false })
        .limit(5);

      // Get student names
      let transactions = [];
      if (recentData && recentData.length > 0) {
        const studentIds = recentData.map((s) => s.student_id);
        const { data: students } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", studentIds);

        transactions = recentData.map((s) => ({
          id: s.id,
          date: new Date(s.start_time).toLocaleDateString(),
          studentName: students?.find((p) => p.id === s.student_id)?.full_name || "Unknown",
          amount: s.amount,
          status: s.status,
        }));
      }

      setEarningsState({
        currentMonth: currentMonthData?.reduce((sum, s) => sum + s.amount, 0) || 0,
        lastMonth: lastMonthData?.reduce((sum, s) => sum + s.amount, 0) || 0,
        totalEarnings: totalData?.reduce((sum, s) => sum + s.amount, 0) || 0,
        pendingPayout: pendingData?.reduce((sum, s) => sum + s.amount, 0) || 0,
        recentTransactions: transactions,
      });
    };

    loadEarnings();
  }, [user?.id]);
  

  const percentChange =
    earningsState.lastMonth > 0
      ? (((earningsState.currentMonth - earningsState.lastMonth) / earningsState.lastMonth) * 100).toFixed(1)
      : "0";
  const isPositiveChange = earningsState.currentMonth >= earningsState.lastMonth;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Earnings</CardTitle>
        <Button variant="outline" size="sm"onClick={() => setshowReports(true)}>
          <FileText className="mr-2 h-4 w-4" /> Financial Reports
        </Button>
        <FinancialReportsModal
  open={showReports}
  onClose={() => setshowReports(false)}
  transactions={earnings.recentTransactions}
/>

      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-gray-500">Current Month</h4>
              {percentChange !== "0" && (
                <div className={`flex items-center text-xs ${isPositiveChange ? "text-green-600" : "text-red-600"}`}>
                  <TrendingUp className={`mr-1 h-3 w-3 ${!isPositiveChange ? "rotate-180" : ""}`} />
                  {percentChange.replace("-", "")}%
                </div>
              )}
            </div>
            <div className="flex items-center mt-2">
              <DollarSign className="text-primary h-6 w-6" />
              <span className="text-2xl font-bold">{earningsState.currentMonth.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h4 className="text-gray-500">Total Earnings</h4>
            <div className="flex items-center mt-2">
              <DollarSign className="text-primary h-6 w-6" />
              <span className="text-2xl font-bold">{earningsState.totalEarnings.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h4 className="text-gray-500">Pending Payout</h4>
            <div className="flex items-center mt-2">
              <DollarSign className="text-primary h-6 w-6" />
              <span className="text-2xl font-bold">{earningsState.pendingPayout.toFixed(2)}</span>
            </div>
            {earningsState.pendingPayout > 0 && (
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
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {earningsState.recentTransactions.length > 0 ? (
                  earningsState.recentTransactions.map((txn) => (
                    <tr key={txn.id}>
                      <td className="px-4 py-3">{txn.date}</td>
                      <td className="px-4 py-3">{txn.studentName}</td>
                      <td className="px-4 py-3 font-medium">${txn.amount.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        {txn.status === "completed" ? (
                          <span className="text-green-700 bg-green-100 rounded-full px-2 py-1 text-xs font-semibold">Completed</span>
                        ) : (
                          <span className="text-yellow-700 bg-yellow-100 rounded-full px-2 py-1 text-xs font-semibold">Pending</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                      No transactions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EarningsSection;