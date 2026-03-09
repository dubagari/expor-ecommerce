import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, Bell, User, Search, LogOut, Settings, UserCircle } from "lucide-react";
import { toast } from "sonner";
import NotificationPanel from "./NotificationPanel";
import { cn } from "../lib/utils";

const Header = ({ setSidebarOpen }) => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_user");
    toast.success("Logged out successfully");
    navigate("/signin");
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 z-10 relative">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="max-w-md w-full hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative">
          <button 
            onClick={() => {
              setNotificationOpen(!notificationOpen);
              if (!notificationOpen) setUnreadCount(0);
            }}
            className={cn(
              "relative p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all active:scale-95 group cursor-pointer",
              notificationOpen && "bg-zinc-100 dark:bg-zinc-800"
            )}
          >
            <Bell className={cn(
              "w-5 h-5 transition-colors",
              notificationOpen ? "text-indigo-600" : "text-zinc-600 dark:text-zinc-400 group-hover:text-indigo-500"
            )} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900 animate-pulse" />
            )}
          </button>
          
          <NotificationPanel 
            isOpen={notificationOpen} 
            onClose={() => setNotificationOpen(false)} 
          />
        </div>
        
        <div className="h-8 w-px bg-zinc-200 dark:border-zinc-800 mx-1 md:mx-2" />

        <div className="relative group/profile">
          <div 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 pl-2 cursor-pointer group/item"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-none group-hover/item:text-indigo-600 transition-colors">Admin User</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1 uppercase italic font-mono font-bold tracking-tighter">Store Owner</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-500/10 group-hover/item:scale-105 active:scale-95 transition-all">
              <User className="w-5 h-5" />
            </div>
          </div>

          {/* Profile Dropdown */}
          {profileOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute top-14 right-0 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                  <p className="text-xs font-bold text-zinc-400 uppercase italic font-mono tracking-widest">Account Access</p>
                </div>
                <div className="p-2">
                  <Link 
                    to="/settings" 
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl text-sm font-bold italic transition-colors text-zinc-600 dark:text-zinc-400 hover:text-indigo-600"
                  >
                    <UserCircle className="w-4 h-4" />
                    View Profile
                  </Link>
                  <Link 
                    to="/settings" 
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl text-sm font-bold italic transition-colors text-zinc-600 dark:text-zinc-400 hover:text-indigo-600"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-2 mx-2" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl text-sm font-bold italic transition-colors text-rose-600"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
