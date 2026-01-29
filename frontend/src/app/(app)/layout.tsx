"use client";

import { Sidebar } from "@/components/layout/Sidebar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 transition-all duration-300 relative">
        {children}
      </main>
    </div>
  );
}
