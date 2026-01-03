/**
 * =========================================================
 * File: AdminLayout.jsx
 * ---------------------------------------------------------
 * Purpose:
 * - Define the overall layout structure for admin pages.
 *
 * Responsibilities:
 * - Render admin sidebar and topbar
 * - Provide outlet container for nested admin routes
 *
 * Notes:
 * - Uses React Router <Outlet /> for child routes
 * - Pure layout component with no business logic
 * =========================================================
 */

import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ================= SIDEBAR ================= */}
      <AdminSidebar />

      {/* ================= MAIN AREA ================= */}
      <div className="flex-1 flex flex-col">
        {/* -------- TOPBAR -------- */}
        <AdminTopbar />

        {/* -------- PAGE CONTENT -------- */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}










