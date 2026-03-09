import { useState } from "react";
import { 
  Settings as SettingsIcon, 
  Store, 
  CreditCard, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Save,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Lock,
  ShoppingBag,
  Info,
  Clock,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "../lib/utils";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("Store");
  const [loading, setLoading] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    sales: true,
    customers: true,
    stock: false,
    system: true
  });

  const toggleSetting = (key) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = [
    { id: "Store", icon: Store },
    { id: "Payment", icon: CreditCard },
    { id: "Profile", icon: User },
    { id: "Notifications", icon: Bell },
  ];

  const handleSave = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Settings updated successfully!");
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Configure your store preferences and account details.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-2xl text-sm font-bold uppercase italic font-mono tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? <span className="animate-spin">◌</span> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="lg:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold font-mono uppercase italic text-xs tracking-widest",
                activeTab === tab.id 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-indigo-400"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.id}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
                {tabs.find(t => t.id === activeTab)?.icon && (() => {
                  const Icon = tabs.find(t => t.id === activeTab).icon;
                  return <Icon className="w-5 h-5" />;
                })()}
              </div>
              <h2 className="text-xl font-bold">{activeTab} Configuration</h2>
            </div>

            <div className="p-8 space-y-8">
              {activeTab === "Store" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase italic font-mono text-zinc-500 ml-1">Store Name</label>
                    <input 
                      type="text" 
                      defaultValue="Antigravity Shop"
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-bold italic"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase italic font-mono text-zinc-500 ml-1">Support Email</label>
                    <input 
                      type="email" 
                      defaultValue="hi@antigravity.shop"
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-mono italic"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase italic font-mono text-zinc-500 ml-1">Currency</label>
                    <select className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-bold italic">
                      <option>NGN (Naira)</option>
                      <option>USD (Dollar)</option>
                      <option>GBP (Pound)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase italic font-mono text-zinc-500 ml-1">Store Address</label>
                    <textarea 
                      defaultValue="12, Tech Avenue, Innovation City"
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all h-24 font-medium italic resize-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === "Payment" && (
                <div className="space-y-6">
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-4">
                    <ShieldCheck className="w-10 h-10 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold text-emerald-800 dark:text-emerald-400 italic">Secure Payment Integration</p>
                      <p className="text-xs text-emerald-600 mt-1 font-medium">Your marketplace uses Paystack for high-speed, secure transactions.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase italic font-mono text-zinc-500 ml-1">Paystack Public Key</label>
                      <div className="relative">
                        <input 
                          type="password" 
                          defaultValue="pk_test_************************"
                          className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-mono"
                        />
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase italic font-mono text-zinc-500 ml-1">Paystack Secret Key</label>
                      <div className="relative">
                        <input 
                          type="password" 
                          defaultValue="sk_test_************************"
                          className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-mono"
                        />
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Profile" && (
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-3xl bg-linear-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-indigo-500/20 group cursor-pointer relative overflow-hidden">
                      A
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Smartphone className="w-6 h-6" />
                      </div>
                    </div>
                    <button className="text-xs font-bold text-indigo-600 uppercase italic font-mono underline">Change Avatar</button>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase italic font-mono text-zinc-500 ml-1">Admin Name</label>
                      <input 
                        type="text" 
                        defaultValue="Admin User"
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-bold italic"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase italic font-mono text-zinc-500 ml-1">Login Email</label>
                      <input 
                        type="email" 
                        defaultValue="admin@antigravity.shop"
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-mono italic"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Notifications" && (
                <div className="space-y-10">
                  {/* Toggles Section */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-bold uppercase italic font-mono text-zinc-400 tracking-widest pl-1">Delivery Channels</h3>
                    {[
                      { id: "sales", title: "Order Sales", desc: "Get notified when someone buys a product", icon: ShoppingBag },
                      { id: "customers", title: "New Customers", desc: "Get notified when a new account is created", icon: User },
                      { id: "stock", title: "Stock Alerts", desc: "Get notified when a product is low on stock", icon: Store },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 hover:border-indigo-400/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-700">
                            <item.icon className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-bold italic text-sm text-zinc-900 dark:text-zinc-100">{item.title}</p>
                            <p className="text-xs text-zinc-500 font-medium">{item.desc}</p>
                          </div>
                        </div>
                        <div 
                          onClick={() => toggleSetting(item.id)}
                          className="relative inline-flex items-center cursor-pointer group scale-110"
                        >
                          <input type="checkbox" className="sr-only peer" checked={notificationSettings[item.id]} readOnly />
                          <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-indigo-600 shadow-inner" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* History Section */}
                  <div className="space-y-6 pt-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase italic font-mono text-zinc-400 tracking-widest pl-1">Recent Activity Log</h3>
                      <button className="text-[10px] font-bold text-indigo-600 uppercase italic font-mono hover:underline">Clear History</button>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { type: 'sale', title: 'New Sale: MacBook Pro M2', time: '12 mins ago', icon: ShoppingBag, color: 'emerald' },
                        { type: 'user', title: 'User Registered: Amaka Okafor', time: '2 hours ago', icon: User, color: 'violet' },
                        { type: 'system', title: 'Server Cache Cleared', time: 'Yesterday', icon: Info, color: 'zinc' },
                        { type: 'sale', title: 'Refund Requested: #ORD-9901', time: '2 days ago', icon: ShoppingBag, color: 'rose' },
                      ].map((log, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all group cursor-pointer">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                            log.color === 'emerald' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" :
                            log.color === 'violet' ? "bg-violet-50 text-violet-600 dark:bg-violet-500/10" :
                            log.color === 'rose' ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10" :
                            "bg-zinc-100 text-zinc-600 dark:bg-zinc-800"
                          )}>
                            <log.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate italic">{log.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-bold uppercase italic font-mono text-zinc-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {log.time}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-3xl border border-indigo-100 dark:border-indigo-500/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-indigo-600" />
              <p className="text-sm font-bold text-indigo-900 dark:text-indigo-400 italic">Advanced Security: 2FA is currently disabled</p>
            </div>
            <button className="px-4 py-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold uppercase italic font-mono hover:bg-indigo-200 transition-all">
              Enable Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal icon for Payment Tab (referenced but not defined by lucide above)
const ShieldCheck = Shield;

export default Settings;
