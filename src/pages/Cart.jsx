import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { increaseQty, decreaseQty, removeFromCart } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState("free");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = shipping === "free" ? 0 : shipping === "standard" ? 10 : 20;

  const coupons = {
    SAVE10: 0.10,
    FLAT50: 0.50,
    FREESHIP: "freeshipping",
  };

  const handleApplyCoupon = () => {
    const code = couponCode.toUpperCase();
    if (appliedCoupon) {
      toast.info("Coupon already applied");
      return;
    }

    if (coupons[code]) {
      if (coupons[code] === "freeshipping") {
        setShipping("free");
        toast.success("Free shipping applied!");
      } else if (coupons[code] < 1) {
        setDiscount(subtotal * coupons[code]);
        toast.success("Percentage discount applied!");
      } else {
        setDiscount(coupons[code]);
        toast.success("Flat discount applied!");
      }
      setAppliedCoupon(code);
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const total = Math.max(subtotal + shippingCost - discount, 0);

  const handleIncrease = (item) => {
    dispatch(increaseQty(item.id));
    toast.info("Increased quantity");
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      dispatch(decreaseQty(item.id));
      toast.info("Decreased quantity");
    } else {
      dispatch(removeFromCart(item.id));
      toast.error("Item removed from cart");
    }
  };

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId));
    toast.error("Item removed from cart");
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.warning("Cart is empty");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto" data-testid="cart-page">
      <h2 className="text-3xl font-semibold mb-8">Shopping Cart</h2>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500" data-testid="empty-cart">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4" data-testid="cart-items">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between border p-4 rounded bg-white shadow"
                data-testid={`cart-item-${item.id}`}
              >
                <div className="flex gap-4 items-center">
                  <img src={item.image} alt={item.title} className="w-20 h-20 object-contain" />
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <div className="flex items-center gap-2" data-testid={`quantity-controls-${item.id}`}>
                        <button
                          onClick={() => handleDecrease(item)}
                          className="px-2 py-1 border rounded"
                          data-testid={`decrease-btn-${item.id}`}
                        >
                          -
                        </button>
                        <span data-testid={`quantity-${item.id}`}>{item.quantity}</span>
                        <button
                          onClick={() => handleIncrease(item)}
                          className="px-2 py-1 border rounded"
                          data-testid={`increase-btn-${item.id}`}
                        >
                          +
                        </button>
                      </div>
                      <p className="font-medium text-green-600">
                        ${item.price.toFixed(2)} x {item.quantity} ={" "}
                        <span className="font-semibold text-black">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 hover:underline mt-4 sm:mt-0"
                  data-testid={`remove-btn-${item.id}`}
                >
                  ×
                </button>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <div className="flex w-full sm:max-w-md border rounded overflow-hidden" data-testid="coupon-section">
                <input
                  type="text"
                  placeholder="coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full p-2 border-r outline-none"
                  data-testid="coupon-input"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 bg-orange-400 text-white hover:bg-orange-500"
                  data-testid="apply-coupon-btn"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded shadow h-fit" data-testid="cart-summary">
            <h3 className="text-xl font-semibold mb-4">Cart Total</h3>
            <div className="flex justify-between border-b py-2">
              <span>Subtotal:</span>
              <span data-testid="subtotal">${subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between border-b py-2 text-green-600 font-medium" data-testid="discount">
                <span>Discount ({appliedCoupon}):</span>
                <span>- ${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="py-4 border-b" data-testid="shipping-options">
              <p className="mb-2 font-medium">Shipping:</p>
              <label>
                <input type="radio" name="shipping" value="free" checked={shipping === "free"} onChange={() => setShipping("free")} data-testid="ship-free" /> Free
              </label>
              <label>
                <input type="radio" name="shipping" value="standard" checked={shipping === "standard"} onChange={() => setShipping("standard")} data-testid="ship-standard" /> Standard
              </label>
              <label>
                <input type="radio" name="shipping" value="express" checked={shipping === "express"} onChange={() => setShipping("express")} data-testid="ship-express" /> Express
              </label>
            </div>

            <div className="flex justify-between mt-6 text-lg font-bold">
              <span>Total:</span>
              <span className="text-orange-600" data-testid="total">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-6 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
              data-testid="checkout-btn"
            >
              PROCEED TO CHECKOUT
            </button>

            <button
              className="mt-3 w-full border border-gray-400 py-2 rounded hover:bg-gray-100"
              onClick={() => window.history.back()}
              data-testid="continue-shopping-btn"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
