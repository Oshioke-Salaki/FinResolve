"use client";

import { useState, useMemo } from "react";
import { useFinancial } from "@/contexts/FinancialContext";
import { formatCurrency } from "@/lib/parseInput";
import { CATEGORY_META, SpendingCategory } from "@/lib/types";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";

export default function ActivityPage() {
  const { profile, isLoading } = useFinancial();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "expense" | "income" | "transfer"
  >("all");
  const [filterCategory, setFilterCategory] = useState<
    SpendingCategory | "all"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortOrder, setSortOrder] = useState<
    "newest" | "oldest" | "amount_high" | "amount_low"
  >("newest");

  // Filter and Sort
  const filteredTransactions = useMemo(() => {
    let result = [...profile.monthlySpending];

    // Filter by Search
    if (searchTerm) {
      const lowerIds = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.description?.toLowerCase().includes(lowerIds) ||
          t.amount.toString().includes(lowerIds) ||
          CATEGORY_META[t.category].label.toLowerCase().includes(lowerIds),
      );
    }

    // Filter by Type
    if (filterType !== "all") {
      result = result.filter((t) => {
        const type = t.type || "expense"; // Default to expense if undefined
        return type === filterType;
      });
    }

    // Filter by Category
    if (filterCategory !== "all") {
      result = result.filter((t) => t.category === filterCategory);
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0).getTime();
      const dateB = new Date(b.createdAt || b.date || 0).getTime();

      switch (sortOrder) {
        case "newest":
          return dateB - dateA;
        case "oldest":
          return dateA - dateB;
        case "amount_high":
          return b.amount - a.amount;
        case "amount_low":
          return a.amount - b.amount;
        default:
          return dateB - dateA;
      }
    });

    return result;
  }, [
    profile.monthlySpending,
    searchTerm,
    filterType,
    filterCategory,
    sortOrder,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const currentTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getTypeColor = (type?: string) => {
    if (type === "income") return "text-green-600 bg-green-50";
    if (type === "transfer") return "text-blue-600 bg-blue-50";
    return "text-red-600 bg-red-50";
  };

  const getTypeIcon = (type?: string) => {
    if (type === "income") return <ArrowDownLeft className="w-4 h-4" />;
    if (type === "transfer") return <ArrowUpDown className="w-4 h-4" />;
    return <ArrowUpRight className="w-4 h-4" />;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Activity History</h1>
        <p className="text-gray-500 mt-1">
          View and manage all your transactions.
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-primary"
          >
            <option value="all">All Types</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
            <option value="transfer">Transfer</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-primary"
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORY_META).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.emoji} {meta.label}
              </option>
            ))}
          </select>

          <div className="h-6 w-px bg-gray-200 mx-2" />

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-primary"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount_high">Highest Amount</option>
            <option value="amount_low">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No transactions found matching your filters.
                  </td>
                </tr>
              ) : (
                currentTransactions.map((t) => {
                  const meta = CATEGORY_META[t.category];
                  const isIncome = t.type === "income";
                  const isTransfer = t.type === "transfer";

                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${getTypeColor(t.type)}`}
                          >
                            {getTypeIcon(t.type)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {t.description || meta.label}
                            </p>
                            {isTransfer && t.destinationAccountId && (
                              <p className="text-xs text-gray-500">
                                To Destination
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                          {meta.emoji} {meta.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(
                          t.createdAt || t.date || "",
                        ).toLocaleDateString("en-NG", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span
                          className={`text-sm font-bold ${
                            isIncome
                              ? "text-green-600"
                              : isTransfer
                                ? "text-blue-600"
                                : "text-slate-800"
                          }`}
                        >
                          {isIncome ? "+" : isTransfer ? "→" : "-"}{" "}
                          {formatCurrency(t.amount)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
