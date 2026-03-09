import { useState, useEffect } from "react";
import { 
  Users as UsersIcon, 
  Search, 
  Mail, 
  Trash2, 
  User, 
  Calendar, 
  ShieldCheck, 
  MoreVertical,
  Loader2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import apiClient from "../api/apiClient";
import { cn, formatDate } from "../lib/utils";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get("/users");
      // Sort by newest first
      setCustomers(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      toast.error(error.message || "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer? This action cannot be undone.")) return;
    
    try {
      await apiClient.delete(`/users/${id}`);
      setCustomers(customers.filter(c => c._id !== id));
      toast.success("Customer deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete customer");
    }
  };

  const filteredCustomers = customers.filter(c => {
    const fullName = `${c.firstname} ${c.surname}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || 
           c.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-8 animate-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage and view your store's customer base.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
            <UsersIcon className="w-4 h-4" />
            <span className="text-xs font-bold uppercase italic font-mono tracking-tighter">{customers.length} Members</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono italic">Total Customers</p>
            <p className="text-3xl font-bold mt-2">{customers.length}</p>
          </div>
          <UsersIcon className="absolute -bottom-2 -right-2 w-20 h-20 text-zinc-100 dark:text-zinc-800 transition-transform group-hover:scale-110 group-hover:rotate-6" />
        </div>
        
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono italic">New This Month</p>
            <p className="text-3xl font-bold mt-2">
              {customers.filter(c => new Date(c.createdAt) > new Date(new Date().getFullYear(), new Date().getMonth(), 1)).length}
            </p>
          </div>
          <Calendar className="absolute -bottom-2 -right-2 w-20 h-20 text-zinc-100 dark:text-zinc-800 transition-transform group-hover:scale-110 group-hover:rotate-6" />
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono italic">Verified Users</p>
            <p className="text-3xl font-bold mt-2">{customers.length}</p> {/* Placeholder for actual verification logic */}
          </div>
          <ShieldCheck className="absolute -bottom-2 -right-2 w-20 h-20 text-zinc-100 dark:text-zinc-800 transition-transform group-hover:scale-110 group-hover:rotate-6" />
        </div>
      </div>

      {/* Filters & Search */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-sm font-bold uppercase italic font-mono tracking-widest text-zinc-400">Loading directory...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
            <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-zinc-300" />
            </div>
            <p className="font-bold text-xl uppercase italic font-mono tracking-tighter">No customers found</p>
            <p className="text-zinc-500 text-sm mt-1">Try a different search term.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-widest font-mono italic font-bold">
                  <th className="px-6 py-5">Customer</th>
                  <th className="px-6 py-5">Contact Information</th>
                  <th className="px-6 py-5">Join Date</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm font-medium">
                {filteredCustomers.map((c) => (
                  <tr key={c._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-lg uppercase group-hover:scale-110 transition-transform">
                          {c.firstname[0]}{c.surname[0]}
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-zinc-100 italic text-base">
                            {c.firstname} {c.surname}
                          </p>
                          <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded-md font-bold italic">
                            Customer Profile
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 mb-1">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="font-mono text-xs">{c.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-mono text-zinc-500 italic">
                      {formatDate(c.createdAt)}
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => deleteCustomer(c._id)}
                          className="p-2.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl text-zinc-400 hover:text-rose-600 transition-all active:scale-90"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;
