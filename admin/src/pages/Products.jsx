import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  ExternalLink,
  Loader2,
  Image as ImageIcon,
  PackageCheck
} from "lucide-react";
import { toast } from "sonner";
import apiClient from "../api/apiClient";
import { formatPrice, cn } from "../lib/utils";
import ProductModal from "../components/ProductModal";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        apiClient.get("/products"),
        apiClient.get("/products/categories")
      ]);
      setProducts(productsRes);
      setCategories(["All", ...categoriesRes]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSave = (savedProduct) => {
    if (selectedProduct) {
      setProducts(products.map(p => p._id === savedProduct._id ? savedProduct : p));
    } else {
      setProducts([savedProduct, ...products]);
    }
    // Update categories list if new category added
    if (!categories.includes(savedProduct.category)) {
      setCategories([...categories, savedProduct.category]);
    }
  };

  const openAddModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your shop inventory and listings.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold font-mono hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 uppercase italic"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-indigo-500" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                selectedCategory === cat 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-indigo-500"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-sm font-medium text-zinc-500">Loading inventory...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-center p-8">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center">
              <PackageCheck className="w-8 h-8 text-zinc-400" />
            </div>
            <div>
              <p className="font-bold text-lg">No products found</p>
              <p className="text-sm text-zinc-500 max-w-xs mx-auto mt-1">Try adjusting your filters or search query to find what you're looking for.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider italic font-mono">
                  <th className="px-6 py-4 font-bold">Product</th>
                  <th className="px-6 py-4 font-bold">Category</th>
                  <th className="px-6 py-4 font-bold">Price</th>
                  <th className="px-6 py-4 font-bold">Stock</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden border border-zinc-200 dark:border-zinc-700 shrink-0">
                          {product.image?.[0] ? (
                            <img 
                              src={`${import.meta.env.VITE_BASE_URL || "http://localhost:5005"}/${product.image[0]}`} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]">{product.name}</p>
                          <p className="text-xs text-zinc-500 truncate max-w-[200px]">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono tracking-tighter bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 uppercase italic">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold font-mono italic">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          product.stock > 10 ? "bg-emerald-500" : product.stock > 0 ? "bg-amber-500" : "bg-rose-500"
                        )} />
                        <span className="font-medium">{product.stock} units</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(product)}
                          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-indigo-600"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
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

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSave={handleSave}
      />
    </div>
  );
};

export default Products;
