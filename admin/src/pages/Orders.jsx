import { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Loader2,
  PackageCheck,
  ChevronRight,
  User,
  MoreVertical
} from "lucide-react";
import { toast } from "sonner";
import apiClient from "../api/apiClient";
import { formatPrice, cn, formatDate } from "../lib/utils";
import OrderDetailsModal from "../components/OrderDetailsModal";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statuses = ["All", "Pending", "processing", "Shipped", "Delivered", "Cancelled"];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get("/orders");
      // Sort by newest first
      setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      toast.error(error.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await apiClient.put(`/orders/${id}`, { status: newStatus });
      setOrders(orders.map(order => order._id === id ? { ...order, status: newStatus } : order));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const filteredOrders = orders.filter(order => {
    const customerName = `${order.userId?.firstname} ${order.userId?.surname}`.toLowerCase();
    const matchesSearch = customerName.includes(searchQuery.toLowerCase()) || 
                          order._id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "All" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered": return <CheckCircle2 className="w-4 h-4" />;
      case "processing": return <Clock className="w-4 h-4" />;
      case "shipped": return <Truck className="w-4 h-4" />;
      case "cancelled": return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered": return "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20";
      case "processing": return "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-100 dark:border-amber-500/20";
      case "shipped": return "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20";
      case "cancelled": return "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border-rose-100 dark:border-rose-500/20";
      default: return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700";
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage and track your customer purchases.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold uppercase italic font-mono tracking-tighter">{orders.length} Total Orders</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by Order ID or Customer name..." 
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-widest transition-all uppercase italic",
                selectedStatus === status 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 active:scale-95" 
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-indigo-400"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-sm font-bold uppercase italic font-mono tracking-widest text-zinc-400">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
            <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-zinc-300" />
            </div>
            <p className="font-bold text-xl uppercase italic font-mono tracking-tighter">No orders found</p>
            <p className="text-zinc-500 text-sm mt-1">We couldn't find any orders matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-widest font-mono italic font-bold">
                  <th className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800">Order & Customer</th>
                  <th className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800">Date</th>
                  <th className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800">Total Amount</th>
                  <th className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800">Status</th>
                  <th className="px-12 py-5 border-b border-zinc-200 dark:border-zinc-800 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm font-medium">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate italic">
                            {order.userId?.firstname} {order.userId?.surname}
                          </p>
                          <p className="text-xs text-zinc-500 font-mono tracking-tighter truncate opacity-70">
                            #{order._id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-mono text-zinc-600 dark:text-zinc-400 italic">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-6 font-bold text-zinc-900 dark:text-zinc-100 font-mono text-base italic underline decoration-transparent group-hover:decoration-indigo-500/20 underline-offset-4 transition-all">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-6 py-6">
                      <div className="relative inline-block">
                        <select 
                          className={cn(
                            "appearance-none pl-8 pr-10 py-1.5 rounded-full text-xs font-bold uppercase italic font-mono tracking-tighter border-2 outline-none cursor-pointer group-hover:scale-105 transition-all",
                            getStatusStyles(order.status)
                          )}
                          value={order.status}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                        >
                          {statuses.filter(s => s !== "All").map(s => (
                            <option key={s} value={s} className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">{s}</option>
                          ))}
                        </select>
                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2">
                          {getStatusIcon(order.status)}
                        </div>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          <MoreVertical className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <button 
                        onClick={() => viewOrderDetails(order)}
                        className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 transition-all hover:shadow-md hover:shadow-indigo-500/5 hover:-translate-y-0.5 active:translate-y-0 group/btn"
                      >
                        <Eye className="w-5 h-5 group-hover/btn:scale-110 transition-all" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <OrderDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default Orders;
