// app/seller/products/edit/[productId]/page.jsx (Example structure for Next.js App Router)
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "../../../../components/ProductForm"; // Assuming this is the correct path
import {
  fetchProductById,
  updateProduct,
  resetSingleProduct,
  resetProductError,
  resetProductMessage,
} from "../../../../redux/features/productSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const EditProductPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  // Assuming the product ID is accessed via router params
  const { productID } = useParams();

  // Select state from the Redux store
  const {
    singleProduct,
    loading,
    error,
    message: successMessage,
  } = useAppSelector((state) => state.product);
  

  // 1. Fetch the product data on component mount
  useEffect(() => {
    if (productID) {
      dispatch(fetchProductById(productID));
    }

    // Cleanup when component unmounts
    return () => {
      // Clear the single product state to prevent old data flashing
      dispatch(resetSingleProduct()); 
      dispatch(resetProductError());
      dispatch(resetProductMessage());
    };
  }, [dispatch, productID]);

  // 2. Handle successful update (e.g., redirect or show message)
  useEffect(() => {
    if (successMessage === "Product updated successfully") {
      // You can redirect the user or show a toast notification
      alert("✅ Product updated successfully!");
      // Example: Redirect to the seller's product list after a delay
      setTimeout(() => {
        router.push(`/Products/${productID}`);
      }, 1000);
    }
  }, [successMessage, router]);

  // 3. Handle form submission
  const handleUpdate = async (formData) => {
    if (!productID) {
      console.error("Product ID is missing for update.");
      return;
    }
    
    // The ProductForm returns a FormData object.
    // We wrap it for the updateProduct thunk structure: { id, data }
    try {
      // We don't await the dispatch call itself, but we let the thunk run.
      // The state changes (loading, message, error) are handled by Redux.
      await dispatch(
        updateProduct({ id: productID, data: formData })
      ).unwrap();
    } catch (err) {
      // Catch errors thrown by the thunk's rejectWithValue
      console.error("Failed to update product:", err);
    }
  };

  // 4. Loading/Error States
  
  if (loading && !singleProduct) {
    return (
      <div className="p-8 text-center text-lg text-gray-500">
        Loading product details...
      </div>
    );
  }

  // Check if we have product data and it's not an empty object (from reset)
  const productDataReady = singleProduct && Object.keys(singleProduct).length > 0;

  if (error && !productDataReady) {
    return (
      <div className="p-8 text-center text-red-600">
        Error: {error}. Could not fetch product details.
      </div>
    );
  }

  if (!productDataReady) {
    // This case covers when productId is present but product hasn't been fetched yet,
    // or if the fetch returned null/undefined (e.g., product not found)
    return (
        <div className="p-8 text-center text-gray-500">
          {loading ? "Loading..." : "Product not found or ID is missing."}
        </div>
    );
  }

  // 5. Render the form with initial data
   return (
      <div className="pt-[100px] min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    ✏️ Edit Product: {singleProduct.title}
                </h2>
                
                <ProductForm
        initialData={{
          title: singleProduct.title,
          description: singleProduct.description,
          price: singleProduct.price.toString(), // Ensure price is string for input value
          category: singleProduct.category,
          stock: singleProduct.stock.toString(), // Ensure stock is string for input value
          // Assuming singleProduct.images is an array of URL strings
          images: singleProduct.images, 
        }}
        onSubmit={handleUpdate}
        loading={loading}
        submitButtonText="Update Product"
      />

            </div>
        </div> 
  // <div className="pt-[100px] flex  min-h-screen bg-gray-50 flex items-center justify-center px-4">
  //           <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
  //               <h2 className="text-2xl font-bold text-gray-800 mb-6">
  //      ✏️ Edit Product: {singleProduct.title}
  //               </h2>
  //               </div>
  //     {/* Display error message specific to the submission process */}
  //     {error && !loading && (
  //       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
  //         <strong className="font-bold">Update Failed:</strong>
  //         <span className="block sm:inline"> {error}</span>
  //         <span 
  //           className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
  //           onClick={() => dispatch(resetProductError())}
  //         >
  //           &times;
  //         </span>
  //         </div>
      
  //     )}

  //     <ProductForm
  //       // Map the singleProduct data to the initialData structure expected by ProductForm
  //       initialData={{
  //         title: singleProduct.title,
  //         description: singleProduct.description,
  //         price: singleProduct.price.toString(), // Ensure price is string for input value
  //         category: singleProduct.category,
  //         stock: singleProduct.stock.toString(), // Ensure stock is string for input value
  //         // Assuming singleProduct.images is an array of URL strings
  //         images: singleProduct.images, 
  //       }}
  //       onSubmit={handleUpdate}
  //       loading={loading}
  //       submitButtonText="Update Product"
  //     />
  //   </div>
  );
};

export default EditProductPage;