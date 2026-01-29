"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Plus } from "lucide-react";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: any) => void;
}

export function AddTransactionModal({
  isOpen,
  onClose,
  onAdd,
}: AddTransactionModalProps) {
  const [data, setData] = useState({
    amount: "",
    category: "Food",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(data);
    onClose();
    setData({ amount: "", category: "Food", description: "" }); // Reset
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Expense">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (₦)
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
            <option value="Food">Food & Dining</option>
            <option value="Transport">Transportation</option>
            <option value="Rent">Rent & Utilities</option>
            <option value="Shopping">Shopping</option>
            <option value="Entertainment">Entertainment</option>
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
          className="w-full bg-primary text-white font-medium py-3 rounded-xl hover:bg-primary/90 transition-colors flex justify-center items-center gap-2 mt-2"
        >
          <Plus className="w-5 h-5" />
          Add Expense
        </button>
      </form>
    </Modal>
  );
}
