import { useState, useEffect } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import apiClient from "../api/apiClient";

const ProductModal = ({ isOpen, onClose, onSave, product = null }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      setPreviews([]);
      setFiles([]);
      return;
    }
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
      });
    }
  }, [product, isOpen]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + files.length > 5) {
      toast.error("You can only upload up to 5 images");
      return;
    }

    setFiles(prev => [...prev, ...selectedFiles]);
    
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previews[index]);
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Cleanup object URLs on unmount or before new ones are created
  useEffect(() => {
    return () => previews.forEach(url => URL.revokeObjectURL(url));
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    files.forEach(file => data.append("image", file));

    try {
      if (product) {
        const res = await apiClient.put(`/products/${product._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        onSave(res);
        toast.success("Product updated successfully");
      } else {
        const res = await apiClient.post("/products", data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        onSave(res);
        toast.success("Product created successfully");
      }
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-zinc-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold">{product ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-500 uppercase tracking-tighter italic font-mono">Product Name</label>
            <input 
              required
              type="text" 
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-500 uppercase tracking-tighter italic font-mono">Price (₦)</label>
              <input 
                required
                type="number" 
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-500 uppercase tracking-tighter italic font-mono">Stock Quantity</label>
              <input 
                required
                type="number" 
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-500 uppercase tracking-tighter italic font-mono">Category</label>
            <input 
              required
              type="text" 
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-500 uppercase tracking-tighter italic font-mono">Description</label>
            <textarea 
              rows={3}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold uppercase tracking-tighter italic font-mono text-indigo-500">Product Images</label>
            
            {/* Previews Grid */}
            {previews.length > 0 && (
              <div className="grid grid-cols-5 gap-2">
                {previews.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 group/item">
                    <img src={url} alt="preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity shadow-lg"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:border-indigo-400 transition-colors cursor-pointer relative group">
              <Upload className="w-6 h-6 text-zinc-400 group-hover:text-indigo-500 group-hover:scale-110 transition-all" />
              <p className="text-xs text-zinc-500 font-bold uppercase italic font-mono">Click or drag to upload (Max 5)</p>
              <input 
                type="file" 
                multiple 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handleFileChange}
                accept="image/*"
              />
              <p className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase mt-1">
                {files.length} of 5 slots used
              </p>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold uppercase italic font-mono hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              disabled={loading}
              className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold uppercase italic font-mono hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : product ? "Update Listing" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
