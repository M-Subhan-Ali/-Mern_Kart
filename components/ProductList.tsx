"use client";

// import ParticlesBackground from "@/components/ParticleBackground";
import { addToCart } from "../redux/features/cartSlice";
import { deleteProduct, fetchAllProducts, fetchSellerProducts } from "../redux/features/productSlice";
import { fetchUserInfo } from "../redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useTheme } from "../theme/ThemeProvider";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const PER_PAGE = 12;

const ProductList = () => {
  const { products, sellerProducts, loading } = useAppSelector((state) => state.product);
  const { role, user } = useAppSelector((state) => state.user);
  const { cart } = useAppSelector((state) => state.cart);
  const productList = role === "seller" ? sellerProducts : products;

  const dispatch = useAppDispatch();
  const theme = useTheme();
  const route = useRouter();
  const searchParams = useSearchParams();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Pagination state (synced with ?page=)
  const [currentPage, setCurrentPage] = useState(1);

  // Read initial page from URL
  useEffect(() => {
    const p = parseInt(searchParams.get("page") || "1", 10);
    if (!Number.isNaN(p) && p > 0) setCurrentPage(p);
  }, [searchParams]);

  // Keep page in range when product list changes
  const totalPages = Math.max(1, Math.ceil((productList?.length || 0) / PER_PAGE));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  // Slice products for current page
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return (productList || []).slice(start, start + PER_PAGE);
  }, [productList, currentPage]);

  // Fetch products based on role
  useEffect(() => {
    dispatch(fetchUserInfo());
    if (role === "seller") {
      dispatch(fetchSellerProducts());
    } else {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, role]);

  //  Add to cart logic
  const handleAddToCart = async (productId: string) => {
    const alreadyInCart = cart?.items?.some((item) => item.product._id === productId);

    if (alreadyInCart) {
      toast.info("🛒 This item is already in your cart!", {
        position: "bottom-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      toast.success("✅ Added to cart!", {
        position: "bottom-center",
        autoClose: 2000,
      });
    } catch {
      toast.error("Failed to add to cart!", {
        position: "bottom-center",
      });
    }
  };

  // 🛍️ Edit / Delete
  const handleEdit = async (productId: string) => {
    toast.info("Redirecting to edit page...", { position: "bottom-center" });
    route.push(`/Products/${productId}`);
  };

  const confirmDelete = (productId: string) => {
    setSelectedProductId(productId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProductId) return;
    try {
      dispatch(deleteProduct(selectedProductId));
      toast.success("🗑️ Product deleted successfully!", {
        position: "bottom-center",
      });
    } catch {
      toast.error("Failed to delete product.", { position: "bottom-center" });
    } finally {
      setShowDeleteModal(false);
      setSelectedProductId(null);
    }
  };

  //  Pagination helpers
  const goToPage = (page: number) => {
    const clamped = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(clamped);

    // sync to URL ?page=
    const params = new URLSearchParams(searchParams.toString());
    if (clamped === 1) {
      params.delete("page");
    } else {
      params.set("page", String(clamped));
    }
    route.push(`?${params.toString()}`, { scroll: false });
  };

  const renderPageNumbers = () => {
    // Simple, readable pager (1..totalPages). Keep styling minimal to avoid layout changes.
    return Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
      <button
        key={p}
        onClick={() => goToPage(p)}
        className={`px-3 py-1 rounded-md text-sm border transition ${p === currentPage
          ? "bg-[#378C92] text-white border-transparent"
          : "bg-transparent text-gray-300 border-gray-700 hover:bg-gray-800"
          }`}
        aria-current={p === currentPage ? "page" : undefined}
        aria-label={`Go to page ${p}`}
      >
        {p}
      </button>
    ));
  };

  // 🧩 UI
  return (
    <div className="pt-[100px] w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 bg-[linear-gradient(to_left,#241919ff_40%,#241919ff_60%)] pb-12">
      {/* <ParticlesBackground /> */}

      {/* Header */}
      <div className="relative z-10 flex items-center justify-center w-full pb-8">
        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold bg-white/10 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-center"
          style={{ color: theme.colors.text }}
        >
          {role === "seller" ? "My Products" : "All Products"}
        </h1>
      </div>

      {/* Product grid */}
      <div className="relative z-10 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          Array(8)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-4"
              >
                <Skeleton height={192} />
                <div className="mt-4 space-y-2">
                  <Skeleton height={20} width="80%" />
                  <Skeleton height={15} count={2} />
                  <Skeleton height={20} width="40%" />
                  <Skeleton height={12} width="60%" />
                </div>
              </div>
            ))
        ) : productList.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 text-lg italic">
            {role === "seller"
              ? "You haven’t added any products yet."
              : "No products available."}
          </div>
        ) : (
          paginatedProducts.map((product: any) => (
            <div
              key={product._id}
              className="bg-black border border-gray-800 rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
            >
              {/* Image */}
              <Link href={`/Products/${product._id}`}>
                <div className="w-full h-40 sm:h-48 md:h-56 relative">
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>

              {/* Details */}
              <div className="p-4 flex flex-col gap-2 sm:h-1/2 sm:justify-around">
                <h2 className="text-base sm:text-lg font-semibold text-white sm:truncate">
                  {product.title}
                </h2>
                <p className="text-sm text-gray-400 sm:line-clamp-2">
                  {product.description}
                </p>
                <p
                  className="font-semibold text-base sm:text-lg"
                  style={{ color: theme.colors.primary }}
                >
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-xs sm:text-sm font-bold text-gray-400">
                  Seller: {product.seller?.name || user?.name}
                </p>

                {/* Role actions */}
                {role === "buyer" && (
                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-[#7a86a4] to-[#414449] text-white rounded-lg shadow-md hover:from-[#2f6e72] hover:to-[#414449] transition duration-300"
                    >
                      🛒 Add to Cart
                    </button>
                  </div>
                )}

                {role === "seller" && (
                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(product._id)}
                      className="flex-1 px-4 py-2 bg-gray-700 hover:bg-blue-700 text-white text-xs rounded-lg transition duration-300"
                    >
                      ✏️ Edit Product
                    </button>
                    <button
                      onClick={() => confirmDelete(product._id)}
                      className="flex-1 px-4 py-2 bg-red-900 hover:bg-red-700 text-xs text-white rounded-lg transition duration-300"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}

                {role !== "seller" && role !== "buyer" && (
                  <div className="mt-3 text-center">
                    <p className="text-gray-400 text-sm italic">
                      Please log in to view purchase options.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination controls */}
      {!loading && productList.length > 0 && (
        <div className="relative z-10 mt-10 flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md text-sm border border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            ‹ Prev
          </button>

          <div className="flex items-center gap-2">{renderPageNumbers()}</div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md text-sm border border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            Next ›
          </button>

          {/* Small info pill (non-intrusive) */}
          <span className="ml-3 text-xs text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && role === "seller" && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-gray-900/90 text-white rounded-2xl p-6 w-80 shadow-2xl border border-gray-700">
            <h2 className="text-lg font-semibold mb-3 text-center">Confirm Deletion</h2>
            <p className="text-sm text-gray-300 mb-5 text-center leading-relaxed">
              Are you sure you want to delete this product? <br />
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition duration-200"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
