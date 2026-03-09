import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  ShoppingBag, 
  Eye, 
  EyeOff, 
  LogIn,
  Fingerprint,
  ShieldAlert
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import apiClient from "../api/apiClient";
import { cn } from "../lib/utils";

const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiClient.post("/users/admin-login", formData);
      // In a real app we'd save this to a global context or localStorage
      localStorage.setItem("admin_user", JSON.stringify(response));
      toast.success("Welcome back, Admin!");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full relative z-10"
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black italic font-mono tracking-tighter uppercase dark:text-white">Antigravity Shop</span>
          </Link>
          <h1 className="text-3xl font-bold mt-6 tracking-tight text-zinc-900 dark:text-white">Sign In</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium italic font-mono uppercase text-xs tracking-widest">Secure Admin Portal Access</p>
        </div>

        {/* Card */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl shadow-zinc-200/50 dark:shadow-none">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase italic font-mono text-zinc-400 ml-1 tracking-widest">Admin Email</label>
              <div className="relative group/field">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within/field:text-indigo-500 transition-colors" />
                <input 
                  id="email"
                  type="email" 
                  placeholder="admin@example.com" 
                  required
                  onChange={handleChange}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl pl-11 pr-4 py-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono italic"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-bold uppercase italic font-mono text-zinc-400 ml-1 tracking-widest">Access Key</label>
                <button type="button" className="text-[10px] font-bold text-indigo-600 hover:underline uppercase italic font-mono tracking-widest">Forgot?</button>
              </div>
              <div className="relative group/field">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within/field:text-indigo-500 transition-colors" />
                <input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  required
                  onChange={handleChange}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl pl-11 pr-12 py-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-indigo-500 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white rounded-[1.25rem] py-4 text-sm font-bold uppercase italic font-mono tracking-widest shadow-xl shadow-indigo-500/25 hover:bg-indigo-700 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Authenticate
                  <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center bg-zinc-50 dark:bg-zinc-800/50 -mx-8 -mb-8 p-6 rounded-b-[2.5rem] border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 italic">
              New shop partner?{" "}
              <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline ml-1">
                Create Account <ArrowRight className="inline w-3 h-3 ml-0.5 font-bold" />
              </Link>
            </p>
          </div>
        </div>

        {/* Dynamic Security Badge */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 opacity-60 hover:opacity-100 transition-opacity duration-300">
            <Fingerprint className="w-4 h-4 text-indigo-500" />
            <span className="text-[9px] font-bold uppercase italic font-mono tracking-tighter text-zinc-500">Biometric Ready</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 opacity-60 hover:opacity-100 transition-opacity duration-300">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span className="text-[9px] font-bold uppercase italic font-mono tracking-tighter text-zinc-500">End-to-End Encrypted</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signin;
