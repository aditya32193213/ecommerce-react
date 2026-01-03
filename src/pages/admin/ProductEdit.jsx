/**
 * =========================================================
 * File: ProductEdit.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Provide an admin page to edit product details.
 *
 * Responsibilities:
 * - Fetch product by ID, populate form fields.
 * - Submit updated product data to backend.
 * - Provide image preview and publish/discard actions.
 *
 * Notes:
 * - Uses /products/:id endpoints for GET and PUT.
 * =========================================================
 */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/api";
import BackButton from "../../components/admin/BackButton";
import { 
  Save, 
  Package, 
  DollarSign, 
  Layers, 
  FileText, 
  Image as ImageIcon, 
  Database,
  CheckCircle2,
  Sparkles
} from "lucide-react";

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ================= FETCH PRODUCT (Logic Preserved) =================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setTitle(data.title || "");
        setPrice(data.price ?? 0);
        setImage(data.image || "");
        setCategory(data.category || "");
        setDescription(data.description || "");
        setCountInStock(data.countInStock ?? 0);
        setLoading(false);
      } catch (err) {
        toast.error("Could not load product details ❌");
      }
    };
    fetchProduct();
  }, [id]);

  // ================= UPDATE PRODUCT (Logic Preserved) =================
  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put(`/products/${id}`, {
        title,
        price,
        image,
        category,
        description,
        countInStock,
        isDraft: false, // 🔑 publish product when saved
      });
      toast.success("Product published successfully! ✨");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product ⚠️");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="size-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse">Retrieving Product Data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <span className="text-slate-400 font-medium">/ Inventory / Edit Product</span>
        </div>

        {/* ================= HEADER SECTION ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              Edit Product <span className="text-2xl">📝</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Modify product details and sync changes to the live store.
            </p>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-xs font-black uppercase tracking-widest">
            <CheckCircle2 size={14} />
            Active Record
          </div>
        </div>

        <form onSubmit={submitHandler} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Details Card */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50">
                <div className="flex items-center gap-2 mb-6 text-slate-400 font-bold text-xs uppercase tracking-widest">
                  <Package size={14} /> Basic Information
                </div>
                
                <div className="space-y-6">
                  <div className="group">
                    <label htmlFor="product-title" className="block text-sm font-bold text-slate-700 mb-2 ml-1">Product Title</label>
                    <div className="relative">
                      <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="text"
                        id="product-title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Premium Wireless Headphones"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="product-description" className="block text-sm font-bold text-slate-700 mb-2 ml-1">Full Description</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-4 size-4 text-slate-300" />
                      <textarea
                        id="product-description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Tell your customers about this product..."
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-medium h-40 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Inventory & Pricing Card */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50">
                <div className="flex items-center gap-2 mb-6 text-slate-400 font-bold text-xs uppercase tracking-widest">
                  <DollarSign size={14} /> Logistics & Pricing
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="product-price" className="block text-sm font-bold text-slate-700 mb-2 ml-1">Retail Price</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input
                        id="product-price"
                        name="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="product-stock" className="block text-sm font-bold text-slate-700 mb-2 ml-1">Current Stock</label>
                    <div className="relative">
                      <Database className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300" />
                      <input
                        id="product-stock"
                        name="countInStock"
                        type="number"
                        value={countInStock}
                        onChange={(e) => setCountInStock(Number(e.target.value))}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Assets Card */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50">
                <div className="flex items-center gap-2 mb-4 text-slate-400 font-bold text-xs uppercase tracking-widest">
                  <ImageIcon size={14} /> Product Media
                </div>
                
                <div className="aspect-square w-full rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 mb-4 overflow-hidden flex items-center justify-center group relative">
                  {image ? (
                    <>
                      <img src={image} alt="Preview" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm">
                        <span className="text-white text-[10px] font-black uppercase tracking-widest">Active Image</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-300">
                      <ImageIcon size={40} />
                      <span className="text-[10px] font-bold uppercase">No Image Preview</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="product-image" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Image URL 🔗</label>
                    <input
                      id="product-image"
                      name="image"
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="product-category" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Category 📁</label>
                    <div className="relative">
                      <Layers className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-300" />
                      <input
                        id="product-category"
                        name="category"
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g., Electronics"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-[#0F172A] text-white py-4 rounded-[1.5rem] font-bold flex items-center justify-center gap-3 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
                >
                  {isSaving ? (
                    <div className="size-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={18} />
                      Publish Changes
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate("/admin/products")}
                  className="w-full bg-white text-slate-600 border border-slate-200 py-4 rounded-[1.5rem] font-bold hover:bg-slate-50 transition-all active:scale-95"
                >
                  Discard Changes
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;