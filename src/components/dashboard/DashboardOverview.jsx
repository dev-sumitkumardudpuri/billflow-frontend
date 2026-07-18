import React, { useState, useEffect } from "react";
import API from "../../services/api";

function DashboardOverview({ theme, user }) {
  const [metrics, setMetrics] = useState({
    totalWorkCount: 0,
    totalEarned: 0,
    totalPending: 0,
    pendingCount: 0,
  });
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const userCurrencyCode = user?.companyDetails?.currency || "USD";
  const currencySymbols = {
    USD: "$",
    INR: "₹",
    EUR: "€",
    GBP: "£",
    AED: "د.إ",
    CAD: "C$",
    AUD: "A$",
  };
  const currencySymbol = currencySymbols[userCurrencyCode] || "$";

  const fetchDashboardData = async () => {
    try {
      const response = await API.get("/api/invoices/dashboard/stats");
      if (response.data) {
        setMetrics(response.data.metrics);
        setInvoices(response.data.invoices);
      }
    } catch (error) {
      console.error("Failed to load live metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleMarkAsPaid = async (invoiceId) => {
    setActionLoading(invoiceId);
    try {
      const response = await API.patch(`/api/invoices/${invoiceId}/pay`);
      if (response.status === 200) {
        await fetchDashboardData();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Error updating payment state.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <div
          className={`animate-pulse text-xs font-medium tracking-tight ${theme === "dark" ? "text-[#8e8e93]" : "text-[#86868b]"}`}
        >
          Syncing global ledger counters...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 select-none animate-fade-in">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight font-sans">
          Overview
        </h2>
        <p
          className={`text-xs sm:text-[13px] mt-1 ${theme === "dark" ? "text-[#8e8e93]" : "text-[#86868b]"}`}
        >
          Real-time automation metrics and synchronized ledger pipeline.
        </p>
      </div>

      {/* Professional Metrics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Card 01: Earned */}
        <div
          className={`p-5 rounded-xl border flex flex-col justify-between transition-all duration-300 ${
            theme === "dark"
              ? "bg-[#1c1c1e]/40 border-[#2c2c2e] text-[#f5f5f7]"
              : "bg-[#ffffff] border-[#e5e5ea] text-[#1d1d1f] shadow-sm shadow-black/1"
          }`}
        >
          <div className="flex justify-between items-center">
            <span
              className={`text-[11px] font-medium uppercase tracking-wider ${theme === "dark" ? "text-[#8e8e93]" : "text-[#86868b]"}`}
            >
              Total Revenue (Paid)
            </span>
            <svg
              className={`w-4 h-4 ${theme === "dark" ? "text-[#30d158]" : "text-[#248a3d]"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold mt-4 tracking-tight font-sans">
            {currencySymbol}
            {metrics.totalEarned.toFixed(2)}
          </div>
        </div>

        {/* Card 02: Pending */}
        <div
          className={`p-5 rounded-xl border flex flex-col justify-between transition-all duration-300 ${
            theme === "dark"
              ? "bg-[#1c1c1e]/40 border-[#2c2c2e] text-[#f5f5f7]"
              : "bg-[#ffffff] border-[#e5e5ea] text-[#1d1d1f] shadow-sm shadow-black/1"
          }`}
        >
          <div className="flex justify-between items-center">
            <span
              className={`text-[11px] font-medium uppercase tracking-wider ${theme === "dark" ? "text-[#8e8e93]" : "text-[#86868b]"}`}
            >
              Pending Receivables
            </span>
            <span
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${theme === "dark" ? "bg-[#ff9f0a]/10 text-[#ff9f0a]" : "bg-[#ff9500]/10 text-[#b26a00]"}`}
            >
              {metrics.pendingCount} Awaiting
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold mt-4 tracking-tight font-sans">
            {currencySymbol}
            {metrics.totalPending.toFixed(2)}
          </div>
        </div>

        {/* Card 03: Total Activity */}
        <div
          className={`p-5 rounded-xl border flex flex-col justify-between transition-all duration-300 ${
            theme === "dark"
              ? "bg-[#1c1c1e]/40 border-[#2c2c2e] text-[#f5f5f7]"
              : "bg-[#ffffff] border-[#e5e5ea] text-[#1d1d1f] shadow-sm shadow-black/1"
          }`}
        >
          <div className="flex justify-between items-center">
            <span
              className={`text-[11px] font-medium uppercase tracking-wider ${theme === "dark" ? "text-[#8e8e93]" : "text-[#86868b]"}`}
            >
              Total Invoices Processed
            </span>
            <svg
              className="w-4 h-4 opacity-40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold mt-4 tracking-tight font-sans">
            {metrics.totalWorkCount} Units
          </div>
        </div>
      </div>

      {/* Invoice Details Table Section */}
      <div
        className={`rounded-xl border overflow-hidden ${theme === "dark" ? "bg-[#1c1c1e]/20 border-[#2c2c2e]" : "bg-[#ffffff] border-[#e5e5ea] shadow-sm"}`}
      >
        <div
          className={`p-4 border-b ${theme === "dark" ? "border-[#2c2c2e]" : "border-[#e5e5ea]"}`}
        >
          <h3 className="font-semibold text-sm tracking-tight">
            Recent Invoices
          </h3>
        </div>

        {invoices.length === 0 ? (
          <div className="p-12 text-center text-xs tracking-tight opacity-50">
            No active invoice instances discovered in the database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-xs sm:text-[13px]">
              <thead>
                <tr
                  className={`border-b text-[11px] font-medium uppercase tracking-wider ${theme === "dark" ? "bg-[#1c1c1e]/50 border-[#2c2c2e] text-[#636366]" : "bg-[#f5f5f7] border-[#e5e5ea] text-[#8e8e93]"}`}
                >
                  <th className="p-4">Invoice Id</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr
                    key={inv._id}
                    className={`border-b transition-colors ${theme === "dark" ? "border-[#2c2c2e] text-white hover:bg-[#1c1c1e]/30" : "border-[#e5e5ea] text-[#1d1d1f] hover:bg-[#f5f5f7]/50"}`}
                  >
                    <td className="p-4 font-mono text-xs opacity-80">
                      {inv.invoiceNumber}
                    </td>
                    <td className="p-4 font-medium">
                      {inv.clientId?.clientName || "Unknown Client"}
                    </td>
                    <td className="p-4 opacity-70">
                      {new Date(inv.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4 font-semibold">
                      {currencySymbol}
                      {inv.grandTotal.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          inv.status === "Paid"
                            ? theme === "dark"
                              ? "bg-[#30d158]/10 text-[#30d158]"
                              : "bg-[#34c759]/10 text-[#248a3d]"
                            : theme === "dark"
                              ? "bg-[#ff453a]/10 text-[#ff453a]"
                              : "bg-[#ff3b30]/10 text-[#d7261e]"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {inv.status !== "Paid" ? (
                        <button
                          onClick={() => handleMarkAsPaid(inv._id)}
                          disabled={actionLoading === inv._id}
                          className={`px-3 py-1 rounded-md text-[11px] font-medium tracking-tight border cursor-pointer transition-all active:scale-95 disabled:opacity-50 ${
                            theme === "dark"
                              ? "bg-[#ffffff] text-black border-white hover:bg-[#e5e5ea]"
                              : "bg-[#1d1d1f] text-white border-black hover:bg-[#323236]"
                          }`}
                        >
                          {actionLoading === inv._id
                            ? "Processing..."
                            : "Mark as Paid"}
                        </button>
                      ) : (
                        <span className="text-[11px] opacity-40 font-medium">
                          Settled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardOverview;
