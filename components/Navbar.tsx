"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { clearCart, fetchCart } from "../redux/features/cartSlice";
import { fetchUserInfo, logoutUser } from "../redux/features/userSlice";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cookies, , removeCookie] = useCookies(["token"]);

  const router = useRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useAppDispatch();
  const { user, role, isAuthenticated, loading: userLoading } = useAppSelector(
    (state) => state.user
  );
  const { cart } = useAppSelector((state) => state.cart);

  //  Fetch user info from Redux
  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);

  //  Fetch cart when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  //  Close mobile menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleOutsideClick);
    else document.removeEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [menuOpen]);

  //  Logout (Redux)
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      removeCookie("token");
      dispatch(clearCart());
      toast.success("You’ve been logged out successfully!", {
        position: "top-center",
        autoClose: 2500,
      });
      router.push("/");
    } catch {
      toast.error("Something went wrong while logging out.", {
        position: "top-center",
      });
    }
  };

  //  Navigation handlers
  const handleLogin = () => {
    toast.info("Redirecting to Login page...", { position: "bottom-center" });
    router.push("/Login");
  };

  const handleSignUp = () => {
    toast.info("Redirecting to Sign Up page...", { position: "bottom-center" });
    router.push("/SignUp");
  };

  const handleCart = () => {
    toast.info("Opening your cart...", { position: "bottom-center" });
    router.push("/Cart");
  };

  const handleDashboard = () => {
    if (!role) {
      toast.warning("User role not found. Please re-login.", {
        position: "bottom-center",
      });
      return;
    }
    const route = `/${role.charAt(0).toUpperCase() + role.slice(1)}`;
    toast.info(`Redirecting to ${route} Dashboard...`, {
      position: "bottom-center",
    });
    router.push(route);
  };
  return (
    <div className="bg-gray-100">
      <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white fixed w-full z-50">
        <div className="container h-[70px] mx-auto px-4 py-4 flex justify-between items-center">
          {/* === Logo === */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/logo1.png"
                alt="Logo"
                width={130}
                height={130}
                className="w-28 sm:w-32 md:w-36 lg:w-40 h-auto"
              />
            </Link>
          </div>

          {/* === Desktop Menu === */}
          <div className="hidden sm:flex items-center space-x-4">
            {userLoading ? (
              <p className="text-gray-400 animate-pulse">Loading...</p>
            ) : isAuthenticated ? (
              <>
                <button
                  onClick={handleDashboard}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition duration-300 text-sm sm:text-base"
                >
                  Welcome {user?.name || "User"}!
                </button>

                {/* 🛒 Cart with count */}
               {role !== "seller" && <button
                  onClick={handleCart}
                  className="relative px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition duration-300 text-sm sm:text-base"
                >
                  🛒 Cart
                  { isAuthenticated && cart?.items && cart.items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cart.items.length}
                    </span>
                  )}
                </button>}

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white text-black hover:bg-amber-200 rounded-lg transition duration-300 text-sm sm:text-base"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* 🛒 Cart without login */}
               {role !== "seller" && <button
                  onClick={handleCart}
                  className="relative px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition duration-300 text-sm sm:text-base"
                >
                  🛒 Cart
                  { isAuthenticated && cart?.items && cart.items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cart.items.length}
                    </span>
                  )}
                </button>}

                <button
                  onClick={handleLogin}
                  className="px-4 py-2 bg-white text-black hover:bg-amber-200 rounded-lg transition duration-300 text-sm sm:text-base"
                >
                  Login
                </button>
                <button
                  onClick={handleSignUp}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-300 text-sm sm:text-base"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* === Mobile Hamburger === */}
          <div className="sm:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-white focus:outline-none"
            >
              {menuOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>

        {/* === Mobile Slide-Out Menu === */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="sm:hidden fixed top-0 right-0 h-full w-2/3 bg-gray-900 shadow-lg z-[999] p-6 flex flex-col space-y-4 animate-slide-in transition-all duration-300"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="text-white text-right text-xl"
            >
              ✖
            </button>

            {isAuthenticated ? (
              <>
                <p className="font-bold text-white">
                  Hi {user?.name || "User"}
                </p>
               {role !== "seller" && <button
                  onClick={handleCart}
                  className="relative px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
                >
                  🛒 Cart
                  { isAuthenticated && cart?.items && cart.items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cart.items.length}
                    </span>
                  )}
                </button>}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white text-black hover:bg-amber-200 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
               {role !== "seller" && <button
                  onClick={handleCart}
                  className="relative px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
                >
                  🛒 Cart
                  { isAuthenticated && cart?.items && cart.items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cart.items.length}
                    </span>
                  )}
                </button>}
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 bg-white text-black hover:bg-amber-200 rounded-lg transition"
                >
                  Login
                </button>
                <button
                  onClick={handleSignUp}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
