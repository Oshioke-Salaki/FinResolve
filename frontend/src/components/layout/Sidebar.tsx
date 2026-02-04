"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  PieChart,
  Target,
  Settings,
  Menu,
  Sparkles,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useFinancial } from "@/contexts/FinancialContext";

const navItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Budgets and Subs", href: "/budgets", icon: Target },
  { name: "Insights", href: "/insights", icon: Sparkles },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Activity", href: "/activity", icon: Clock },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { profile } = useFinancial();

  // Get display name from profile, user metadata, or email
  const displayName =
    profile.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  // Get user initials
  const getInitials = () => {
    const name = profile.name || user?.user_metadata?.full_name;
    if (name) {
      const names = name.split(" ");
      return names.length > 1
        ? `${names[0][0]}${names[1][0]}`.toUpperCase()
        : names[0].substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <>
      {/* Mobile Trigger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-sm border border-border"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="md:hidden fixed inset-0 bg-black/20 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 bg-white/80 backdrop-blur-xl border-r border-border transition-transform duration-300 md:translate-x-0 feature-sidebar",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <Link href="/" className="mb-10 flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-bold text-lg">Fin</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              FinResolve
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group relative overflow-hidden",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                  />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom/User */}
          <div className="mt-auto pt-6 border-t border-border">
            <Link
              href="/settings"
              className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-muted transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-border">
                <span className="text-sm font-medium text-primary">
                  {getInitials()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground truncate max-w-[140px]">
                  {displayName}
                </span>
                <span className="text-xs text-muted-foreground">Free Plan</span>
              </div>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
