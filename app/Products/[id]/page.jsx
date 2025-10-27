"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ParticlesBackground from "@/components/ParticleBackground";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import {
  deleteProduct,
  fetchProductById,
  resetSingleProduct,
} from "@/redux/features/productSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addToCart } from "@/redux/features/cartSlice";

const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quantity, setQuantity] = useState(1);


  const params = useParams();
  const router = useRouter();
  const { role } = useAppSelector((state) => state.user);
  const { singleProduct } = useAppSelector((state) => state.product);
  const { cart } = useAppSelector((state) => state.cart)

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!params?.id) return;

    dispatch(resetSingleProduct());
    dispatch(fetchProductById(params.id));
  }, [dispatch, params?.id]);

  useEffect(() => {
    if (singleProduct?.images?.length > 0) {
      setSelectedImage(singleProduct.images[0]);
    }
  }, [singleProduct]);

  // ✅ Delete Confirmation Flow
  const confirmDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteProduct(params.id)).unwrap();
      toast.success("🗑️ Product deleted successfully!", {
        position: "bottom-center",
      });
      router.push("/Products");
    } catch {
      toast.error("Failed to delete product.", { position: "bottom-center" });
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleAddToCart = async (productId, quantity) => {
    const alreadyInCart = cart?.items?.some((item) => item.product._id === productId);

    if (alreadyInCart) {
      toast.info("🛒 This item is already in your cart!", {
        position: "bottom-center",
        autoClose: 2000,
      });
      return;
    }

    if (quantity > singleProduct.stock) {
      toast.warning("🚫 Not enough stock!", { position: "bottom-center" });
      return;
    }

    try {
      await dispatch(addToCart({ productId, quantity })).unwrap();
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



  const See_Cart = () => {
    router.push("/Cart")
  }

  if (!singleProduct || Object.keys(singleProduct).length == 0)
    return <div className="p-6">Loading...</div>;

  return (
    <div className="pt-[70px] px-4 sm:px-6 md:px-10 lg:px-32 w-full mx-auto ">
      <ParticlesBackground />

      {/* Back Button */}
      <div className="pt-10">
        <button
          onClick={() => router.back()}
          className="relative z-10 mb-5 mt-2 px-4 py-2 bg-gray-100 border border-gray-300 
          text-[#1F2540] rounded hover:bg-gray-200 transition cursor-pointer 
          w-full sm:w-auto"
        >
          ← Back to Products
        </button>
      </div>

      {/* Main Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Images */}
        <div>
          <div
            className="w-full h-[250px] sm:h-[300px] md:h-[400px] 
                          bg-[linear-gradient(to_left,#241919ff_0%,#ffffff_10%,#ffffff_90%,#241919ff_100%)] 
                          relative border rounded-md overflow-hidden cursor-pointer"
          >
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Selected Product"
                fill
                className="object-contain p-4"
              />
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
            {singleProduct.images.map((img, index) => (
              <div
                key={index}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 border-2 rounded-md cursor-pointer transition 
                  ${img === selectedImage
                    ? "border-[#7a86a4ff]"
                    : "border-gray-300"
                  }`}
                onClick={() => setSelectedImage(img)}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col gap-4 bg-white px-4 sm:px-6 md:px-8 py-6 border rounded-md">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F2540]">
            {singleProduct.title}
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            {singleProduct.description}
          </p>
          <p className="text-xl sm:text-2xl text-green-700 font-semibold">
            Price : ${singleProduct.price.toFixed(2)}
          </p>
          <p className="text-xl text-black w-25  rounded-md font-bold">
            Stock: {singleProduct.stock}
          </p>
            {/* 🔹 Quantity Controls */}
              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-bold text-lg hover:bg-gray-300 transition"
                >
                  -
                </button>

                <span className="text-lg font-semibold">{quantity}</span>

                <button
                  onClick={() => {
                    if (quantity < singleProduct.stock) {
                      setQuantity((prev) => prev + 1);
                    } else {
                      toast.warning("🚫 Cannot exceed stock limit!", {
                        position: "bottom-center",
                      });
                    }
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-bold text-lg hover:bg-gray-300 transition"
                >
                  +
                </button>
              </div>

          <p className="text-sm text-gray-500">
            Seller: {singleProduct.seller?.name}
          </p>

          {/* Buyer Buttons */}
          {role === "buyer" && (
            <div className="grid">
              <button
                onClick={() => See_Cart()}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-[#7a86a4ff] to-[#414449ff]
      text-white font-semibold rounded-lg shadow-md 
      hover:from-[#41cd2bff] hover:to-[#414449ff] 
      focus:outline-none focus:ring-2 focus:ring-[#41cd2bff] focus:ring-offset-2 
      transition duration-300 ease-in-out 
      w-full sm:w-auto"
              >
                All products in cart
              </button>

            
              {/* 🔹 Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(singleProduct._id, quantity)}
                className="mt-3 px-6 py-3 bg-gray-500 text-white rounded-lg 
      hover:bg-orange-500 transition cursor-pointer 
      w-full sm:w-auto"
              >
                Add to Cart
              </button>
            </div>
          )}

          {/* Seller Buttons */}
          {role === "seller" && (
            <div className="grid">
              <Link
                href={`/Products/edit/${params.id}`}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-[#7a86a4ff] to-[#414449ff]
            text-white font-semibold rounded-lg shadow-md 
            hover:from-[#41cd2bff] hover:to-[#414449ff] 
            focus:outline-none focus:ring-2 focus:ring-[#41cd2bff] focus:ring-offset-2 
            transition duration-300 ease-in-out 
            w-full sm:w-auto text-center"
              >
                Edit
              </Link>
              <button
                onClick={confirmDelete}
                className="mt-2 px-6 py-3 bg-gray-500 text-white rounded-lg 
            hover:bg-orange-500 transition cursor-pointer 
            w-full sm:w-auto"
              >
                Delete
              </button>
            </div>
          )}

          {/* Not Logged In */}
          {role !== "seller" && role !== "buyer" && (
            <div className="grid">
              <Link
                href={"/Login"}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-[#7a86a4ff] to-[#414449ff]
              text-white font-semibold rounded-lg shadow-md 
              hover:from-[#41cd2bff] hover:to-[#414449ff] 
            focus:outline-none focus:ring-2 focus:ring-[#41cd2bff] focus:ring-offset-2 
            transition duration-300 ease-in-out 
            w-full sm:w-auto text-center"
              >
                Login for buying or manage products
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 🧩 Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-gray-900/90 text-white rounded-2xl p-6 w-80 shadow-2xl border border-gray-700">
            <h2 className="text-lg font-semibold mb-3 text-center">
              Confirm Deletion
            </h2>
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

export default ProductDetail;
