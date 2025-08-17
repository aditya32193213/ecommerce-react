/**
 * ============================================================
 * File: routes.js
 * Purpose: Centralized configuration for application routes
 * ============================================================
 *
 * Responsibilities:
 * - Define all application routes in a single place
 * - Associate each route with:
 *    - `name` → Human-readable identifier
 *    - `path` → URL pattern
 *    - `element` → Component to render
 *    - `isProtected` → Whether the route requires authentication
 * - Provide a fallback "Not Found" route for invalid URLs
 *
 * ============================================================
 */

// --- PAGE IMPORTS ---
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import ThankYou from "./pages/Thankyou";

/**
 * ============================================================
 *  ROUTE DEFINITIONS
 * ============================================================
 * Each object defines a single route:
 *  - `name`: descriptive label
 *  - `path`: route path
 *  - `element`: component to render
 *  - `isProtected`: authentication requirement
 */
const routes = [
  {
    name: "Home",
    path: "/",
    element: <Home data-testid="home-page" />,
    isProtected: false,
  },
  {
    name: "Product Details",
    path: "/product/:id",
    element: <ProductDetails data-testid="product-details-page" />,
    isProtected: false,
  },
  {
    name: "Cart",
    path: "/cart",
    element: <Cart data-testid="cart-page" />,
    isProtected: false,
  },
  {
    name: "Wishlist",
    path: "/wishlist",
    element: <Wishlist data-testid="wishlist-page" />,
    isProtected: false,
  },
  {
    name: "Login",
    path: "/login",
    element: <Login data-testid="login-page" />,
    isProtected: false,
  },
  {
    name: "Checkout",
    path: "/checkout",
    element: <Checkout data-testid="checkout-page" />,
    isProtected: false,
  },
  {
    name: "Thank You",
    path: "/thank-you",
    element: <ThankYou data-testid="thankyou-page" />,
    isProtected: false,
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    element: <Dashboard data-testid="dashboard-page" />,
    isProtected: true, //  requires authentication
  },
  {
    name: "Not Found",
    path: "*",
    element: (
      <div
        className="text-center mt-10 text-red-500 text-xl font-semibold"
        data-testid="not-found"
      >
        🚫 Page Not Found
      </div>
    ),
    isProtected: false,
  },
];

// --- EXPORT ROUTES ---
export default routes;