import { X, ArrowDownRight, ArrowUpRight, Clock, CheckCircle2, History } from "lucide-react";
import { formatPrice, cn, formatDate } from "../lib/utils";

const transactions = [
  { id: "TX-9281", type: "Sale", amount: 45000, date: new Date().toISOString(), status: "Completed", method: "Paystack" },
  { id: "TX-9282", type: "Sale", amount: 15000, date: new Date(Date.now() - 3600000).toISOString(), status: "Completed", method: "Paystack" },
  { id: "TX-9283", type: "Refund", amount: -12000, date: new Date(Date.now() - 86400000).toISOString(), status: "Completed", method: "Bank Transfer" },
  { id: "TX-9284", type: "Sale", amount: 28000, date: new Date(Date.now() - 172800000).toISOString(), status: "Processing", method: "Paystack" },
  { id: "TX-9285", type: "Sale", amount: 85000, date: new Date(Date.now() - 259200000).toISOString(), status: "Completed", method: "Paystack" },
  { id: "TX-9286", type: "Payout", amount: -150000, date: new Date(Date.now() - 432000000).toISOString(), status: "Completed", method: "Bank Payout" },
  { id: "TX-9287", type: "Sale", amount: 21400, date: new Date(Date.now() - 604800000).toISOString(), status: "Completed", method: "Paystack" },
];

const TransactionModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
              <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Transaction History</h2>
              <p className="text-xs text-zinc-500 font-medium">Review your latest payout and sales activity.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {transactions.map((tx) => (
            <div key={tx.id} className="group flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400/50 transition-all">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-xl",
                  tx.type === "Sale" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" :
                  tx.type === "Refund" ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" :
                  "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                )}>
                  {tx.type === "Sale" ? <ArrowUpRight className="w-5 h-5" /> : 
                   tx.type === "Refund" ? <ArrowDownRight className="w-5 h-5" /> : 
                   <History className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">{tx.type} — #{tx.id}</p>
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider",
                      tx.status === "Completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                    )}>
                      {tx.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(tx.date)}</span>
                    <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                    <span>{tx.method}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "text-lg font-bold font-mono italic underline decoration-2 decoration-indigo-500/20",
                  tx.amount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                )}>
                  {tx.amount > 0 ? "+" : ""}{formatPrice(tx.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-zinc-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>All balances are synced with Paystack</span>
            </div>
            <button className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer uppercase italic font-mono text-xs">
              Go to Payout Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
