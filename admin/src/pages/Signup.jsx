import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  ShoppingBag, 
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
  UserPlus
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import apiClient from "../api/apiClient";
import { cn } from "../lib/utils";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    surname: "",
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
      await apiClient.post("/users/admin-signup", formData);
      toast.success("Admin account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/signin"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
          <h1 className="text-3xl font-bold mt-6 tracking-tight text-zinc-900 dark:text-white">Create Account</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium italic font-mono uppercase text-xs tracking-widest">Join our premium marketplace</p>
        </div>

        {/* Card */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl shadow-zinc-200/50 dark:shadow-none">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase italic font-mono text-zinc-400 ml-1">First Name</label>
                <div className="relative group/field">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within/field:text-indigo-500 transition-colors" />
                  <input 
                    id="firstname"
                    type="text" 
                    placeholder="Admin" 
                    required
                    onChange={handleChange}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium italic"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase italic font-mono text-zinc-400 ml-1">Surname</label>
                <div className="relative group/field">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within/field:text-indigo-500 transition-colors" />
                  <input 
                    id="surname"
                    type="text" 
                    placeholder="Admin" 
                    required
                    onChange={handleChange}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium italic"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase italic font-mono text-zinc-400 ml-1">Email Address</label>
              <div className="relative group/field">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within/field:text-indigo-500 transition-colors" />
                <input 
                  id="email"
                  type="email" 
                  placeholder="admin@example.com" 
                  required
                  onChange={handleChange}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono italic"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase italic font-mono text-zinc-400 ml-1">Secure Password</label>
              <div className="relative group/field">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within/field:text-indigo-500 transition-colors" />
                <input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  required
                  onChange={handleChange}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl pl-11 pr-12 py-3.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
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

            <div className="flex items-center gap-2 px-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <p className="text-[10px] text-zinc-500 font-bold font-mono tracking-tighter uppercase italic">Agree to Premium Terms & Privacy</p>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white rounded-[1.25rem] py-4 text-sm font-bold uppercase italic font-mono tracking-widest shadow-xl shadow-indigo-500/25 hover:bg-indigo-700 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Register Now
                  <UserPlus className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center bg-zinc-50 dark:bg-zinc-800/50 -mx-8 -mb-8 p-6 rounded-b-[2.5rem] border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 italic">
              Already have a shop account?{" "}
              <Link to="/signin" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline ml-1">
                Sign In <ArrowRight className="inline w-3 h-3 ml-0.5" />
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 flex items-center justify-center gap-6 text-zinc-400 grayscale hover:grayscale-0 transition-all duration-500 opacity-60">
          <ShieldCheck className="w-5 h-5" />
          <span className="w-px h-4 bg-zinc-200 dark:bg-zinc-800" />
          <span className="text-[10px] font-bold uppercase italic font-mono tracking-widest">256-Bit SSL Encrypted</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
