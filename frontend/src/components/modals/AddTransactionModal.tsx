"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Plus } from "lucide-react";
import { useFinancial } from "@/contexts/FinancialContext";
import { formatCurrency } from "@/lib/parseInput";

import { CATEGORY_META, CURRENCIES } from "@/lib/types";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: {
    amount: string;
    category: string;
    description: string;
    accountId: string;
  }) => void;
}

export function AddTransactionModal({
  isOpen,
  onClose,
  onAdd,
}: AddTransactionModalProps) {
  const { profile } = useFinancial();
  const currency = profile.currency;
  const currencySymbol = CURRENCIES[currency]?.symbol || "$";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState({
    amount: "",
    category: "food",
    description: "",
    accountId: profile.accounts[0]?.id || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    // Artificial delay for premium feel and to simulate "processing"
    await new Promise((resolve) => setTimeout(resolve, 800));

    onAdd(data);
    setIsSubmitting(false);
    onClose();
    setData({
      amount: "",
      category: "food",
      description: "",
      accountId: profile.accounts[0]?.id || "",
    }); // Reset
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Expense">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account
          </label>
          <select
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
            value={data.accountId}
            onChange={(e) => setData({ ...data, accountId: e.target.value })}
          >
            {profile.accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({formatCurrency(acc.balance, currency)})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount ({currencySymbol})
          </label>
          <input
            type="number"
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            placeholder="e.g. 5000"
            value={data.amount}
            onChange={(e) => setData({ ...data, amount: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
            value={data.category}
            onChange={(e) => setData({ ...data, category: e.target.value })}
          >
            {Object.entries(CATEGORY_META).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.emoji} {meta.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            placeholder="e.g. Lunch with friends"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white font-medium py-3 rounded-xl hover:bg-primary/90 transition-colors flex justify-center items-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Add Expense
            </>
          )}
        </button>
      </form>
    </Modal>
  );
}
