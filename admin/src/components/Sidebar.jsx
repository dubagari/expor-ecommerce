import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Menu, 
  X,
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "../lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Products", icon: Package, path: "/products" },
  { label: "Orders", icon: ShoppingCart, path: "/orders" },
  { label: "Customers", icon: Users, path: "/users" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { pathname } = useLocation();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-transform duration-300 transform",
        !isOpen && "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold group-hover:bg-indigo-700 transition-colors">
                A
              </div>
              <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-100 italic font-mono uppercase">Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group relative",
                    isActive 
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" 
                      : "text-zinc-500 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("w-5 h-5", isActive ? "text-indigo-600 dark:text-indigo-400" : "group-hover:text-indigo-500")} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            <button className="flex items-center gap-3 w-full px-4 py-3 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
