/**
 * =========================================================
 * File: UserList.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Admin user directory for managing accounts and permissions.
 *
 * Responsibilities:
 * - Fetch and display user list with pagination and search.
 * - Support toggling admin privileges and deleting users.
 *
 * Notes:
 * - Uses /users/admin endpoint.
 * =========================================================
 */

import React, { useEffect, useState,useCallback } from "react";
import { toast } from "react-toastify";
import api from "../../config/api";
import { 
  Trash2, 
  ShieldCheck, 
  User, 
  Search, 
  Mail, 
  Calendar, 
  ShieldAlert,
  Users,
  Fingerprint,
} from "lucide-react";
import BackButton from "../../components/admin/BackButton";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [keyword, setKeyword] = useState("");

  // ================= FETCH USERS (Logic Preserved) =================
    const fetchUsers = useCallback(async () => {
  try {
    setLoading(true);
    const { data } = await api.get(
      `/users/admin?page=${page}&keyword=${keyword}`
    );
    setUsers(data.users || []);
    setPages(data.pages || 1);
  } catch (err) {
    toast.error("Failed to sync user database");
  } finally {
    setLoading(false);
  }
}, [page, keyword]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ================= DELETE USER (Logic Preserved) =================
  const deleteUserHandler = async (id) => {
    if (!window.confirm("CRITICAL: Are you sure you want to permanently delete this account? ⚠️")) return;

    try {
      await api.delete(`/users/${id}`);
      toast.success("Identity purged successfully 🗑️");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Deletion protocol failed ⚠️");
    }
  };

  // ================= TOGGLE ADMIN (Logic Preserved) =================
  const toggleAdminHandler = async (id) => {
    try {
      await api.put(`/users/${id}/toggle-admin`);
      toast.success("Permission levels updated! 🔐");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Security update failed ⚠️");
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <span className="text-slate-400 font-medium">/ Security / User Directory</span>
        </div>

        {/* ================= HEADER SECTION ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              User Management <span className="text-2xl">👥</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Audit access permissions and manage the global user registry.
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            <div className="size-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users size={20} />
            </div>
            <div className="pr-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Registered</p>
              <p className="text-sm font-bold text-slate-700">{users.length} Active Nodes</p>
            </div>
          </div>
        </div>

        {/* ================= SEARCH & TOOLBAR ================= */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              id="user-search"
              name="search"
              type="text"
              placeholder="Search by name or email... 🔍"
              value={keyword}
              onChange={(e) => {
                setPage(1);
                setKeyword(e.target.value);
              }}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-medium"
            />
          </div>
        </div>

        {/* ================= TABLE CONTAINER ================= */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2"><Fingerprint size={12}/> Profile Identity</div>
                  </th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2"><Mail size={12}/> Email Address</div>
                  </th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Role Status 🛡️
                  </th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2"><Calendar size={12}/> Join Date</div>
                  </th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Permissions ⚙️
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="size-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                        <p className="text-slate-400 font-bold animate-pulse">Decrypting User Data...</p>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <p className="text-slate-500 font-bold italic">No identities found matching the query.</p>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`size-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                            user.isAdmin ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {user.name.charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-slate-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-sm font-medium text-slate-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-6">
                        {user.isAdmin ? (
                          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit">
                            <ShieldCheck size={12} /> Administrator
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 bg-slate-50 text-slate-500 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit">
                            <User size={12} /> Standard User
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-6 text-sm font-bold text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleAdminHandler(user._id)}
                            className={`p-2 rounded-xl transition-all ${
                              user.isAdmin 
                                ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' 
                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                            }`}
                            title="Toggle Privileges"
                          >
                            <ShieldAlert size={18} />
                          </button>
                          <button
                            onClick={() => deleteUserHandler(user._id)}
                            className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all"
                            title="Purge Identity"
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

        {/* ================= PAGINATION ================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Identity Page {page} of {pages}
          </p>
          <div className="flex items-center gap-2">
            {[...Array(pages).keys()].map((x) => (
              <button
                key={x}
                onClick={() => setPage(x + 1)}
                className={`min-w-[40px] h-10 rounded-xl font-bold text-xs transition-all ${
                  page === x + 1 
                    ? "bg-[#0F172A] text-white shadow-lg shadow-slate-200 scale-110" 
                    : "bg-white text-slate-400 hover:bg-slate-100 border border-slate-200"
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

export default UserList;