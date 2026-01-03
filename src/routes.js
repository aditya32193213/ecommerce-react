/**
 * =========================================================
 * File: routes.js
 * ---------------------------------------------------------
 * Purpose:
 * Centralized routing configuration for the application.
 *
 * Responsibilities:
 * - Define public, protected, and admin routes
 * - Configure lazy loading for performance optimization
 * - Provide metadata for route guards
 *
 * Notes:
 * - Used by App.jsx for recursive route rendering
 * - Admin routes support nested child routes
 * =========================================================
 */


import { Suspense, lazy } from "react";
import ClipLoader from "react-spinners/ClipLoader";

// Eager Load (Critical Pages for SEO/Speed)
import Home from "./pages/user/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Shop from "./pages/user/Shop";

// ✅ LAZY LOAD (Heavy Pages & Stripe)
const ProductDetails = lazy(() => import("./pages/user/ProductDetails"));
const Cart = lazy(() => import("./pages/user/Cart"));
const Wishlist = lazy(() => import("./pages/user/Wishlist"));
const Dashboard = lazy(() => import("./pages/user/Dashboard"));
const Checkout = lazy(() => import("./pages/user/Checkout"));
const ThankYou = lazy(() => import("./pages/user/Thankyou"));
const OrderHistory = lazy(() => import("./pages/user/OrderHistory"));
const OrderDetails = lazy(() => import("./pages/user/OrderDetails"));
const Profile = lazy(() => import("./pages/user/Profile"));
const Payment = lazy(() => import("./pages/user/Payment"));

const ProductList = lazy(() => import("./pages/admin/ProductList"));
const ProductEdit = lazy(() => import("./pages/admin/ProductEdit"));
const OrderList = lazy(() => import("./pages/admin/OrderList"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UserList = lazy(() => import("./pages/admin/UserList"));
const AdminOrderDetails = lazy(() => import("./pages/admin/OrderDetails"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading Fallback
const Loading = () => (
  <div className="flex justify-center items-center h-96">
    <ClipLoader size={50} color="#2563EB" />
  </div>
);

const routes = [
  // ===== USER PAGES (ADMIN BLOCKED, GUEST ALLOWED) =====
  { name: "Home", path: "/", element: <Home />, isProtected: true },
  { name: "Shop", path: "/shop", element: <Shop />, isProtected: true },

  {
    name: "Product Details",
    path: "/product/:id",
    element: (
      <Suspense fallback={<Loading />}>
        <ProductDetails />
      </Suspense>
    ),
    isProtected: true,
  },

  // ===== AUTH (PUBLIC) =====
  { name: "Login", path: "/login", element: <Login />, isProtected: false },
  { name: "Signup", path: "/signup", element: <Signup />, isProtected: false },

  {
    name: "Forgot Password",
    path: "/forgot-password",
    element: (
      <Suspense fallback={<Loading />}>
        <ForgotPassword />
      </Suspense>
    ),
    isProtected: false,
  },
  {
    name: "Reset Password",
    path: "/reset-password/:token",
    element: (
      <Suspense fallback={<Loading />}>
        <ResetPassword />
      </Suspense>
    ),
    isProtected: false,
  },

  // ===== AUTHENTICATED USER ONLY =====
  {
    name: "Cart",
    path: "/cart",
    element: (
      <Suspense fallback={<Loading />}>
        <Cart />
      </Suspense>
    ),
    isProtected: true,
  },
  {
    name: "Wishlist",
    path: "/wishlist",
    element: (
      <Suspense fallback={<Loading />}>
        <Wishlist />
      </Suspense>
    ),
    isProtected: true,
  },
  {
    name: "Checkout",
    path: "/checkout",
    element: (
      <Suspense fallback={<Loading />}>
        <Checkout />
      </Suspense>
    ),
    isProtected: true,
  },
  {
    name: "Payment",
    path: "/payment",
    element: (
      <Suspense fallback={<Loading />}>
        <Payment />
      </Suspense>
    ),
    isProtected: true,
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    element: (
      <Suspense fallback={<Loading />}>
        <Dashboard />
      </Suspense>
    ),
    isProtected: true,
  },
  {
    name: "Orders",
    path: "/orders",
    element: (
      <Suspense fallback={<Loading />}>
        <OrderHistory />
      </Suspense>
    ),
    isProtected: true,
  },
  {
    name: "Order Details",
    path: "/orders/:id",
    element: (
      <Suspense fallback={<Loading />}>
        <OrderDetails />
      </Suspense>
    ),
    isProtected: true,
  },
  {
    name: "Profile",
    path: "/profile",
    element: (
      <Suspense fallback={<Loading />}>
        <Profile />
      </Suspense>
    ),
    isProtected: true,
  },
  {
    name: "Thank You",
    path: "/thankyou",
    element: (
      <Suspense fallback={<Loading />}>
        <ThankYou />
      </Suspense>
    ),
    isProtected: true,
  },

  // ===== ADMIN ROUTES =====
  {
    path: "/admin",
    element: (
      <Suspense fallback={<Loading />}>
        <AdminLayout />
      </Suspense>
    ),
    isProtected: true,
    isAdmin: true,
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "products", element: <ProductList /> },
      { path: "product/:id/edit", element: <ProductEdit /> },
      { path: "orders", element: <OrderList /> },
      { path: "orders/:id", element: <AdminOrderDetails /> },
      { path: "users", element: <UserList /> },
    ],
  },

  // ===== 404 =====
  {
    name: "Not Found",
    path: "*",
    element: (
      <Suspense fallback={<Loading />}>
        <NotFound />
      </Suspense>
    ),
    isProtected: false,
  },
];

export default routes;





