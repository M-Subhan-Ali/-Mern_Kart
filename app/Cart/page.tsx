"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  clearCartLocal,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from "@/redux/features/cartSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";



const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter(); 
  const { cart, loading } = useAppSelector((state) => state.cart);
  const { isAuthenticated, loading: userLoading, user } = useAppSelector(
    (state) => state.user
  ); 

  const isLoggedIn = isAuthenticated;

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCart());
    } else {
      dispatch(clearCartLocal());
    }
  }, [dispatch, isLoggedIn]);

  // handle seller role
  useEffect(() => {
    if (user?.role === "seller") {
      // redirect seller automatically
      router.push("/Seller");

      //  message for debugging
      console.log("Seller logged in showing message instead of cart");
    }
  }, [user]);

  const handleRemove = async (id: string) => {
    try {
      await dispatch(removeCartItem(id)).unwrap();
      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleQuantityChange = async (id: string, qty: number) => {
    if (qty <= 0) return;
    try {
      await dispatch(updateCartItem({ productId: id, quantity: qty })).unwrap();
    } catch {
      toast.error("Failed to update quantity");
    }
  };

const handleCheckout = async () => {
  try {
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

    // Create session
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_ROUTE}/api/payment/create-checkout-session`,
      {}, 
      { withCredentials: true }
    );

    const { url } = response.data;
    if (!url) throw new Error("No checkout URL received from backend.");

    // ✅ Redirect to Stripe Checkout
    window.location.href = url;
  } catch (error: any) {
    console.error("Checkout error:", error);
    toast.error(error.response?.data?.error || "Checkout failed, please try again.");
  }
};







  const total =
    cart?.items?.reduce((sum, i) => sum + i.product.price * i.quantity, 0) || 0;

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 animate-pulse text-lg font-medium">
          Checking authentication...
        </p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-50">
        <Image src="/logo.png" alt="Login" width={250} height={250} />
        <h2 className="text-2xl font-semibold text-gray-800 mt-6">
          Please login to view your cart 🛒
        </h2>
        <Link
          href="/Login"
          className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-500 to-gray-700 text-white font-medium hover:from-gray-600 hover:to-gray-800 transition-all duration-300 shadow-md"
        >
          Login Now
        </Link>
      </div>
    );
  }

  // ✅ NEW: Seller-specific message (if not redirected)
  if (user?.role === "seller") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-50">
        <Image src="/logo.png" alt="Seller" width={200} height={200} />
        <h2 className="text-2xl font-semibold text-gray-800 mt-6">
          Hello Seller 👋
        </h2>
        <p className="text-gray-500 mt-2 max-w-sm">
          You don’t have a cart because sellers manage products, not purchases.
        </p>
        <Link
          href="/Seller/Dashboard"
          className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-500 to-gray-700 text-white font-medium hover:from-gray-600 hover:to-gray-800 transition-all duration-300 shadow-md"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 animate-pulse text-lg font-medium">
          Loading your cart...
        </p>
      </div>
    );

  if (!cart?.items?.length)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-b from-gray-50 to-gray-200 px-4">
        <Image
          src="/logo.png"
          alt="Empty cart"
          width={260}
          height={260}
          className="drop-shadow-lg animate-float"
        />
        <h2 className="text-2xl font-semibold text-gray-800 mt-6">
          Your cart is feeling empty 🛒
        </h2>
        <p className="text-gray-500 mt-2 max-w-sm">
          Looks like you haven't added anything yet. Explore our collection and
          find something you'll love!
        </p>
        <Link
          href="/Products"
          className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-500 to-gray-700 text-white font-medium hover:from-gray-600 hover:to-gray-800 transition-all duration-300 shadow-md"
        >
          Continue Shopping
        </Link>

        <style jsx>{`
          @keyframes float {
            0% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-6px);
            }
            100% {
              transform: translateY(0);
            }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    );

  return (
    <div className="pt-[90px] pb-20 px-4 sm:px-8 md:px-16 bg-gradient-to-b from-gray-50 to-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
        🛍 Your Shopping Cart
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT SIDE - Cart Items */}
        <div className="flex-1 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <div className="divide-y divide-gray-200">
            {cart.items.map((item) => (
              <div
                key={item.product._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-5 hover:bg-gray-50 rounded-xl transition"
              >
                <div className="flex items-center gap-5">
                  <Image
                    src={item.product.images?.[0] || "/no-image.png"}
                    alt={item.product.title}
                    width={90}
                    height={90}
                    className="rounded-lg object-cover border border-gray-200 shadow-sm"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item.product.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5 mt-4 sm:mt-0">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.product._id,
                          item.quantity - 1
                        )
                      }
                      className="px-3 py-1 hover:bg-gray-100 text-lg"
                    >
                      −
                    </button>
                    <span className="px-4 py-1 font-medium text-gray-700 bg-gray-50">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.product._id,
                          item.quantity + 1
                        )
                      }
                      className="px-3 py-1 hover:bg-gray-100 text-lg"
                    >
                      +
                    </button>
                  </div>
                  <p className="w-24 text-right font-semibold text-gray-700">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemove(item.product._id)}
                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - Summary */}
        <div className="lg:w-1/3 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 h-fit sticky top-28">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Order Summary
          </h2>

          <div className="flex justify-between text-gray-600 mb-2">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600 mb-2">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between text-gray-600 mb-2">
            <span>Tax (5%)</span>
            <span>${(total * 0.05).toFixed(2)}</span>
          </div>

          <hr className="my-4 border-gray-300" />

          <div className="flex justify-between text-lg font-semibold text-gray-800">
            <span>Total</span>
            <span>${(total * 1.05).toFixed(2)}</span>
          </div>

          <button
           onClick={handleCheckout}
          className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-gray-500 to-gray-700 text-white font-medium hover:from-gray-600 hover:to-gray-800 transition-all duration-300 shadow-md">
            Proceed to Checkout
          </button>

          <Link
            href="/Buyer"
            className="block text-center mt-4 text-gray-600 hover:text-gray-800 transition"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
