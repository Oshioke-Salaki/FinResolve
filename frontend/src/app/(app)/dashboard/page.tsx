"use client";

import { useState } from "react";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage, type Role } from "@/components/chat/ChatMessage";
import { SuggestedQuestions } from "@/components/chat/SuggestedQuestions";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { GoalCard } from "@/components/dashboard/GoalCard";
import { TrendingUp, Wallet } from "lucide-react";

interface Message {
  id: string;
  role: Role;
  content: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Good morning, John! ☀️ You've got ₦45,000 left for the week. How can I help you manage your money today?",
  },
];

const SUGGESTIONS = [
  "Where is my money going?",
  "Can I afford a new phone?",
  "Save ₦20,000 this month",
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

  const handleSend = (content: string) => {
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, newUserMsg]);

    // Mock AI response
    setTimeout(() => {
      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm analyzing that for you... (This is a demo response)",
      };
      setMessages((prev) => [...prev, newAiMsg]);
    }, 1000);
  };

  return (
    <div className="flex h-screen max-h-screen overflow-hidden bg-gray-50/50">
      {/* Chat Section (Main) */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Header Area */}
        <header className="px-6 py-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-100 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-800">
            Financial Coach
          </h1>
          <div className="md:hidden">
            {/* Mobile Menu Trigger Placeholder (Sidebar handles it but this is for context) */}
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 bg-gradient-to-t from-white via-white to-transparent pb-8">
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            <SuggestedQuestions questions={SUGGESTIONS} onSelect={handleSend} />
            <ChatInput onSend={handleSend} />
          </div>
        </div>
      </div>

      {/* Dashboard Section (Right Sidebar - Desktop Only) */}
      <div className="hidden xl:block w-96 border-l border-border bg-white h-full overflow-y-auto p-6 space-y-8">
        <div>
          <h2 className="text-sm uppercase tracking-wider text-gray-400 font-semibold mb-4">
            Daily Snapshot
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-700">
                  Budget Left
                </span>
              </div>
              <p className="text-xl font-bold text-green-800">₦45,000</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">Saved</span>
              </div>
              <p className="text-xl font-bold text-blue-800">₦12,500</p>
            </div>
          </div>

          <div className="h-64">
            <SpendingChart />
          </div>
        </div>

        <div>
          <h2 className="text-sm uppercase tracking-wider text-gray-400 font-semibold mb-4">
            Active Goals
          </h2>
          <div className="space-y-4">
            <GoalCard
              title="Emergency Fund"
              target={1000000}
              current={250000}
              deadline="Dec 2024"
              color="bg-emerald-500"
            />
            <GoalCard
              title="New MacBook"
              target={2500000}
              current={500000}
              deadline="June 2024"
              color="bg-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
