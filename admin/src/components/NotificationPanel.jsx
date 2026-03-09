import { useState, useRef, useEffect } from "react";
import { 
  Bell, 
  ShoppingBag, 
  User, 
  Info, 
  X, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  Trash2,
  BellOff
} from "lucide-react";
import { cn } from "../lib/utils";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "order",
    title: "New Order #ORD-8921",
    description: "Amaka Okafor just placed an order for Bluetooth Speaker.",
    time: "2 mins ago",
    unread: true,
  },
  {
    id: 2,
    type: "user",
    title: "New Customer Registered",
    description: "John Doe joined the marketplace.",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    type: "system",
    title: "System Update",
    description: "Dashboard version 2.0 has been successfully deployed.",
    time: "5 hours ago",
    unread: false,
  },
  {
    id: 4,
    type: "order",
    title: "Order Delivered",
    description: "Order #ORD-7721 has been marked as delivered.",
    time: "Yesterday",
    unread: false,
  }
];

const NotificationPanel = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const panelRef = useRef(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const deleteOne = (e, id) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={panelRef}
      className="absolute top-16 right-0 w-[calc(100vw-32px)] sm:w-[400px] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 rounded-4xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="p-5 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/30">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base tracking-tight">Activity</h3>
            <p className="text-[10px] font-bold text-zinc-400 uppercase italic font-mono tracking-widest mt-0.5">
              {notifications.filter(n => n.unread).length} Unread Alerts
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={markAllAsRead}
            className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-indigo-600 transition-all title='Mark as read'"
          >
            <CheckCircle2 className="w-4 h-4" />
          </button>
          <button 
            onClick={clearAll}
            className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-rose-600 transition-all"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mb-4 relative overflow-hidden group">
              <BellOff className="w-10 h-10 text-zinc-300 dark:text-zinc-700 relative z-10" />
              <div className="absolute inset-0 bg-indigo-500/5 group-hover:scale-150 transition-transform duration-500 rounded-full" />
            </div>
            <p className="font-bold text-lg italic font-mono uppercase tracking-tighter text-zinc-900 dark:text-white">All caught up!</p>
            <p className="text-zinc-400 text-xs mt-1 max-w-[200px]">No new notifications to display right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                onClick={onClose}
                className={cn(
                  "p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all group cursor-pointer relative",
                  n.unread && "bg-indigo-50/20 dark:bg-indigo-500/5"
                )}
              >
                {n.unread && (
                  <div className="absolute top-6 right-6 w-2 h-2 bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/40" />
                )}
                <div className="flex gap-4">
                  <div className={cn(
                    "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border border-transparent transition-all group-hover:scale-110 shadow-sm",
                    n.type === "order" ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" :
                    n.type === "user" ? "bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20" :
                    "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                  )}>
                    {n.type === "order" ? <ShoppingBag className="w-5 h-5" /> : 
                     n.type === "user" ? <User className="w-5 h-5" /> : 
                     <Info className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    <p className="font-bold text-[13px] text-zinc-900 dark:text-zinc-100 leading-tight mb-1">{n.title}</p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">{n.description}</p>
                    <div className="flex items-center gap-2 text-[9px] text-zinc-400 mt-2 font-bold font-mono uppercase italic tracking-wider">
                      <Clock className="w-3.5 h-3.5" />
                      {n.time}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => deleteOne(e, n.id)}
                    className="absolute right-4 bottom-4 p-2 opacity-0 group-hover:opacity-100 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg text-rose-500 transition-all scale-75"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800">
        <button className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold font-mono uppercase italic text-zinc-500 hover:text-indigo-600 transition-colors group">
          View all activity
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;
