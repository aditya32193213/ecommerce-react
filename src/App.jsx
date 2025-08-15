// import Navbar from "./components/layout/Navbar";
// import Footer from "./components/layout/Footer";
// import { Route, Routes } from "react-router-dom";
// import Home from "./pages/Home";
// import ProductDetails from "./pages/ProductDetails";
// import Cart from "./pages/Cart";
// import Wishlist from "./pages/Wishlist";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import ProtectedRoute from "./components/Common/ProtectedRoute";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Banner from "./components/sections/banner";
// import AOS from "aos";
// import { useEffect } from "react";
// import "aos/dist/aos.css";
// import Checkout from "./pages/Checkout";
// import ThankYou from "./pages/Thankyou";

// function App() {
//   useEffect(() => {
//     AOS.init({ duration: 600, once: true });
//   }, []);
  
//   return (
//     <div className="min-h-screen flex flex-col" data-testid="app-container">
//       <Navbar data-testid="navbar" />
//       <Banner data-testid="banner" />

//       <main className="flex-grow" data-testid="main-content">
//         <Routes>
//           <Route path="/" element={<Home data-testid="home-page" />} />
//           <Route
//             path="/product/:id"
//             element={<ProductDetails data-testid="product-details-page" />}
//           />
//           <Route path="/cart" element={<Cart data-testid="cart-page" />} />
//           <Route
//             path="/wishlist"
//             element={<Wishlist data-testid="wishlist-page" />}
//           />
//           <Route path="/login" element={<Login data-testid="login-page" />} />
//           <Route
//             path="/checkout"
//             element={<Checkout data-testid="checkout-page" />}
//           />
//           <Route
//             path="/thank-you"
//             element={<ThankYou data-testid="thankyou-page" />}
//           />

//           {/* ✅ Protected Dashboard Route */}
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Dashboard data-testid="dashboard-page" />
//               </ProtectedRoute>
//             }
//           />

//           {/* Fallback Route */}
//           <Route
//             path="*"
//             element={
//               <div
//                 className="text-center mt-10 text-red-500 text-xl font-semibold"
//                 data-testid="not-found"
//               >
//                 🚫 Page Not Found
//               </div>
//             }
//           />
//         </Routes>
//       </main>

//       <Footer data-testid="footer" />
//       <ToastContainer position="top-center" autoClose={2000} />
//     </div>
//   );
// }

// export default App;

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { Route, Routes } from "react-router-dom";
import Banner from "./components/sections/banner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos";
import { useEffect } from "react";
import "aos/dist/aos.css";
import routes from "./routes";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  return (
    <div className="min-h-screen flex flex-col" data-testid="app-container">
      <Navbar data-testid="navbar" />
      <Banner data-testid="banner" />

      <main className="flex-grow" data-testid="main-content">
        <Routes>
          {routes.map(({ path, element, isProtected }, index) => (
            <Route
              key={index}
              path={path}
              element={isProtected ? <ProtectedRoute>{element}</ProtectedRoute> : element}
            />
          ))}
        </Routes>
      </main>

      <Footer data-testid="footer" />
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}

export default App;

