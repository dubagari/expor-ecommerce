import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  PackageCheck,
  Clock,
  Download,
  Plus,
  Loader2
} from "lucide-react";
import { cn, formatPrice, formatDate } from "../lib/utils";
import ProductModal from "../components/ProductModal";
import TransactionModal from "../components/TransactionModal";
import apiClient from "../api/apiClient";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
  <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div className={cn("p-3 rounded-xl", color)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className={cn(
        "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
        trend === "up" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
      )}>
        {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {trendValue}%
      </div>
    </div>
    <div className="mt-4">
      <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeUsers: 0,
    totalOrders: 0,
    conversion: "4.2%"
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch both orders for the table and stats for the cards
      const [ordersData, statsData] = await Promise.all([
        apiClient.get("/orders"),
        apiClient.get("/admin/stats")
      ]);

      const sortedOrders = ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders);

      setStats({
        totalRevenue: statsData.revenue,
        activeUsers: statsData.customers,
        totalOrders: statsData.orders,
        topProduct: statsData.topProduct,
        nextPayout: statsData.nextPayout,
        conversion: "4.2%" 
      });
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    try {
      if (orders.length === 0) {
        toast.error("No orders to export");
        return;
      }
      // Create CSV content from real orders
      const headers = ["Order ID", "Customer", "Email", "Amount", "Status", "Date"];
      const rows = orders.map(order => [
        order._id,
        `${order.userId?.firstname || "Guest"} ${order.userId?.surname || ""}`,
        order.userId?.email || "N/A",
        order.totalAmount,
        order.status,
        new Date(order.createdAt).toLocaleDateString()
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `store_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Report downloaded successfully");
    } catch (error) {
      toast.error("Failed to download report");
    }
  };

  const handleProductSave = (product) => {
    toast.success(`Product "${product.name}" created successfully!`);
    // In a real app, we might trigger a stats refresh here
  };
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Welcome back to your shop overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Product
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={formatPrice(stats.totalRevenue)} 
          icon={DollarSign} 
          trend="up" 
          trendValue={12.5} 
          color="bg-indigo-600"
        />
        <StatCard 
          title="Active Users" 
          value={stats.activeUsers.toLocaleString()} 
          icon={Users} 
          trend="up" 
          trendValue={8.2} 
          color="bg-violet-600"
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={ShoppingBag} 
          trend="down" 
          trendValue={3.1} 
          color="bg-pink-600"
        />
        <StatCard 
          title="Conversion" 
          value={stats.conversion} 
          icon={TrendingUp} 
          trend="up" 
          trendValue={1.4} 
          color="bg-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm min-h-[400px]">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
            <h2 className="font-bold text-lg">Recent Orders</h2>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">View All</button>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-zinc-500">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-sm font-bold font-mono tracking-widest uppercase italic">Fetching live orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
              <ShoppingBag className="w-12 h-12 opacity-20 mb-2" />
              <p className="font-bold uppercase italic font-mono tracking-tighter">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider font-mono italic font-bold">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group">
                      <td className="px-6 py-4 font-mono font-bold text-[10px] tracking-tighter text-indigo-600 flex flex-col">
                        <span>#{order._id.slice(-8).toUpperCase()}</span>
                        <span className={cn(
                          "mt-1 w-fit px-1.5 py-0.5 rounded text-[8px] uppercase",
                          order.status === "Delivered" ? "bg-emerald-50 text-emerald-600" :
                          order.status === "processing" ? "bg-amber-50 text-amber-600" :
                          "bg-zinc-100 text-zinc-600"
                        )}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-zinc-900 dark:text-zinc-100 italic">
                          {order.userId?.firstname} {order.userId?.surname}
                        </div>
                        <div className="text-xs text-zinc-500 font-mono">{formatDate(order.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 font-bold font-mono italic">{formatPrice(order.totalAmount)}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors group-hover:text-indigo-600">
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Store Insights */}
        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden">
            <div className="relative z-10 font-mono italic font-bold">
              <h3 className="text-lg opacity-80 uppercase tracking-wider">Top Selling</h3>
              <p className="text-2xl mt-2 truncate pr-10">{stats.topProduct?.name || "No Sales"}</p>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-70">Price</p>
                  <p className="text-xl font-bold">{formatPrice(stats.topProduct?.price || 0)}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
                  <PackageCheck className="w-6 h-6" />
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-40 h-40 bg-white/10 rounded-full blur-3xl opacity-20" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-40 h-40 bg-zinc-950/20 rounded-full blur-3xl opacity-20" />
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between mb-6 italic font-bold font-mono uppercase">
              <h3 className="font-bold">Next Payout</h3>
              <Clock className="w-4 h-4 text-zinc-400" />
            </div>
            <p className="text-3xl font-bold">{formatPrice(stats.nextPayout || 0)}</p>
            <p className="text-xs text-zinc-500 mt-2">Expected by {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
            <button 
              onClick={() => setIsTransactionOpen(true)}
              className="w-full mt-6 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl text-sm font-bold font-mono hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors italic uppercase cursor-pointer"
            >
              Review Transactions
            </button>
          </div>
        </div>
      </div>

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleProductSave}
      />

      <TransactionModal 
        isOpen={isTransactionOpen}
        onClose={() => setIsTransactionOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
