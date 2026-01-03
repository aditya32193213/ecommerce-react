/**
 * =========================================================
 * File: ProductList.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Admin product catalog listing with search, pagination and CRUD actions.
 *
 * Responsibilities:
 * - Fetch products via admin endpoint.
 * - Allow create, edit and delete actions for products.
 * - Support search and pagination.
 *
 * Notes:
 * - Uses /products endpoint.
 * =========================================================
 */


import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/api";
import { Edit, Trash2, Plus, Search, Package, Filter } from "lucide-react";
import BackButton from "../../components/admin/BackButton";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [keyword, setKeyword] = useState("");

  const navigate = useNavigate();

  // ================= FETCH PRODUCTS (Logic Preserved) =================
  const fetchProducts = useCallback(async () => {
  try {
    setLoading(true);
    const { data } = await api.get(
      `/products?page=${page}&keyword=${keyword}`
    );
    setProducts(data.products || []);
    setPages(data.pages || 1);
  } catch (error) {
    toast.error("Failed to load products");
  } finally {
    setLoading(false);
  }
}, [page, keyword]);


  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ================= DELETE PRODUCT (Logic Preserved) =================
  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  // ================= CREATE PRODUCT (Logic Preserved) =================
  const createHandler = async () => {
    try {
      const { data } = await api.post("/products", { isDraft: true });
      navigate(`/admin/product/${data._id}/edit`);
    } catch (err) {
      toast.error("Failed to create product");
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <span className="text-slate-400">/ Inventory</span>
        </div>

        {/* ================= PREMIUM HEADER ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              Product Catalog <span className="text-2xl">📦</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Manage your inventory, pricing, and categories with ease.
            </p>
          </div>
          
          <button
            onClick={createHandler}
            className="group bg-[#0f172a] text-white px-6 py-3 rounded-2xl flex items-center gap-3 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all duration-300"
          >
            <div className="bg-white/10 p-1 rounded-lg group-hover:rotate-90 transition-transform">
              <Plus size={18} />
            </div>
            <span className="font-bold">Add New Product</span>
          </button>
        </div>

        {/* ================= SEARCH & FILTERS ================= */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              id="product-search" 
              name="search"
              type="text"
              placeholder="Search by name, ID or category... 🔍"
              value={keyword}
              onChange={(e) => {
                setPage(1);
                setKeyword(e.target.value);
              }}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
          
          <button className="px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-colors font-semibold">
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>

        {/* ================= TABLE CONTAINER ================= */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Product Details 🏷️
                  </th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Price 💰
                  </th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Category 📁
                  </th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Status ⚡
                  </th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Actions ⚙️
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="size-10 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
                        <p className="text-slate-400 font-bold animate-pulse">Scanning Inventory...</p>
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                          <Package size={32} />
                        </div>
                        <p className="text-slate-500 font-bold italic">No products matched your search.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold border border-slate-200 overflow-hidden group-hover:border-blue-200 transition-colors">
                            {product.image ? (
                                <img src={product.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <Package size={20} />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {product.title}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                              ID: {product._id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-slate-400">$</span>
                          <span className="text-sm font-black text-slate-800">{product.price}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-tighter shadow-sm">
                          {product.category || "General"}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[11px] font-bold text-emerald-600 uppercase">Live</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-end items-center gap-2">
                          <Link
                            to={`/admin/product/${product._id}/edit`}
                            className="p-2.5 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-all active:scale-90"
                            title="Edit Product"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => deleteHandler(product._id)}
                            className="p-2.5 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all active:scale-90"
                            title="Delete Product"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= PREMIUM PAGINATION ================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Page {page} of {pages} • Total Items: {products.length}
          </p>
          <div className="flex items-center gap-2">
            {[...Array(pages).keys()].map((x) => (
              <button
                key={x}
                onClick={() => setPage(x + 1)}
                className={`min-w-[40px] h-10 rounded-xl font-bold text-xs transition-all ${
                  page === x + 1 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110" 
                    : "bg-white text-slate-400 hover:bg-slate-100 hover:text-slate-600 border border-slate-200"
                }`}
              >
                {x + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;