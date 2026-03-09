import { X, Package, MapPin, Truck, Phone, Mail, User, Clock, CheckCircle2 } from "lucide-react";
import { formatPrice, cn, formatDate } from "../lib/utils";

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-zinc-900 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Order Details</h2>
              <p className="text-xs text-zinc-500 font-mono italic uppercase tracking-tighter">#{order._id.toUpperCase()}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[70vh] p-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Customer & Shipping */}
            <div className="space-y-6">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-4 h-4 text-zinc-400" />
                  <h3 className="font-bold text-sm uppercase tracking-wider italic font-mono text-zinc-500">Customer Info</h3>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <p className="font-bold text-lg">{order.userId?.firstname} {order.userId?.surname}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <Mail className="w-3 h-3" />
                      <span>{order.userId?.email}</span>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  <h3 className="font-bold text-sm uppercase tracking-wider italic font-mono text-zinc-500">Shipping Address</h3>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <p className="text-sm font-medium leading-relaxed">
                    {order.shippingAddress?.address || "No address provided"}
                  </p>
                  <p className="text-sm text-zinc-500">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                  <div className="flex items-center gap-2 text-sm text-zinc-500 pt-2 border-t border-zinc-200 dark:border-zinc-800 mt-2">
                    <Phone className="w-3 h-3" />
                    <span>{order.shippingAddress?.phone || "N/A"}</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Order Summary */}
            <div className="space-y-6">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  <h3 className="font-bold text-sm uppercase tracking-wider italic font-mono text-zinc-500">Timeline</h3>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">Placed on</span>
                    <span className="font-bold italic">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                    <span className="text-zinc-500">Payment Status</span>
                    <span className={cn(
                      "font-bold uppercase text-[10px] px-2 py-0.5 rounded-md",
                      order.paymentStatus === "Paid" ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-zinc-600"
                    )}>{order.paymentStatus || "Pending"}</span>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-4 h-4 text-zinc-400" />
                  <h3 className="font-bold text-sm uppercase tracking-wider italic font-mono text-zinc-500">Items Ordered</h3>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                  <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border-b border-zinc-200 last:border-0 dark:border-zinc-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-1">
                            {item.productId?.image?.[0] ? (
                              <img 
                                src={`${import.meta.env.VITE_BASE_URL || "http://localhost:5005"}/${item.productId.image[0]}`} 
                                className="w-full h-full object-cover rounded" 
                                alt="" 
                              />
                            ) : (
                              <Package className="w-full h-full text-zinc-300" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold truncate max-w-[140px]">{item.productId?.name || "Product"}</p>
                            <p className="text-[10px] text-zinc-500 font-mono italic">Qty: {item.quantity} x {formatPrice(item.productId?.price || 0)}</p>
                          </div>
                        </div>
                        <p className="text-sm font-bold font-mono">{formatPrice((item.productId?.price || 0) * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white dark:bg-zinc-900 p-4 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span className="italic">Total Amount</span>
                      <span className="text-indigo-600 decoration-2 decoration-indigo-200 underline underline-offset-4 decoration-dotted">{formatPrice(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl text-sm font-bold uppercase italic font-mono transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-650"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
