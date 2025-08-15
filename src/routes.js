// src/routes.js
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import ThankYou from "./pages/Thankyou";

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
    isProtected: true,
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

export default routes;
