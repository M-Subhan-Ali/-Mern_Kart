"use client";

import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";

// ✅ Define the structure of the form data
interface FormDataType {
  title: string;
  description: string;
  price: string | number;
  category: string;
  stock: string | number;
  existingImages: string[];
}

// ✅ Define props for ProductForm
interface ProductFormProps {
  initialData?: {
    title?: string;
    description?: string;
    price?: number | string;
    category?: string;
    stock?: number | string;
    images?: string[];
  };
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
  submitButtonText?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  loading = false,
  submitButtonText = "Submit",
}) => {
  const [isInitialized, setIsInitialized] = useState(false);

  const [formData, setFormData] = useState<FormDataType>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    category: initialData?.category || "",
    stock: initialData?.stock || "",
    existingImages: initialData?.images || [],
  });

  const [newImages, setNewImages] = useState<File[]>([]);

  // ✅ Initialize data only once (useful for editing)
  useEffect(() => {
    if (initialData && !isInitialized) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        price: initialData.price || "",
        category: initialData.category || "",
        stock: initialData.stock || "",
        existingImages: initialData.images || [],
      });
      setNewImages([]);
      setIsInitialized(true);
    }
  }, [initialData, isInitialized]);

  // ✅ Handle input field change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  // ✅ Remove existing image
  const handleRemoveExistingImage = (imageUrlToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter(
        (url) => url !== imageUrlToRemove
      ),
    }));
  };

  // ✅ Handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();

    // Append all text fields (except existingImages)
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "existingImages") {
        data.append(key, String(value));
      }
    });

    // Keep existing images
    data.append("existingImagesToKeep", JSON.stringify(formData.existingImages));

    // Add new uploaded images
    newImages.forEach((file) => data.append("images", file));

    try {
      await onSubmit(data);

      // Reset form if creating a new product
      if (!initialData) {
        setFormData({
          title: "",
          description: "",
          price: "",
          category: "",
          stock: "",
          existingImages: [],
        });
        setNewImages([]);
      }
    } catch (err) {
      console.error("❌ Error submitting product:", err);
    }
  };

  const categories = [
    "men's clothing",
    "electronics",
    "clothing",
    "Sports",
    "groceries",
    "beauty",
    "women's clothing",
    "jewelery",
    "furniture",
    "fragrances",
    "watch",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Price ($)
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min={1}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer"
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Stock */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Stock</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          required
          min={1}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
        />
      </div>

      {/* Upload new images */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Upload New Images
        </label>
        <input
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1 block w-50 text-gray-900 border border-gray-300 p-2 rounded-md cursor-pointer"
        />
      </div>

      {/* Existing Images */}
      {formData.existingImages.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          <p className="w-full text-sm text-gray-500">
            Existing Images (click trash icon to remove):
          </p>
          {formData.existingImages.map((imageUrl, i) => (
            <div
              key={`existing-${i}`}
              className="relative w-24 h-24 rounded-md border"
            >
              <img
                src={imageUrl}
                alt="Existing Preview"
                className="w-full h-full object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => handleRemoveExistingImage(imageUrl)}
                className="absolute top-[-8px] right-[-8px] bg-red-500 hover:bg-red-700 text-white rounded-full p-1 shadow-md transition duration-150 ease-in-out"
                aria-label="Remove image"
              >
                <FaTrash className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* New Images Preview */}
      {newImages.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          <p className="w-full text-sm text-gray-500">New Images to Upload:</p>
          {newImages.map((file, i) => (
            <img
              key={`new-${i}`}
              src={URL.createObjectURL(file)}
              alt="New Preview"
              className="w-24 h-24 object-cover rounded-md border"
            />
          ))}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full ${
          loading ? "bg-gray-400" : "bg-teal-600 hover:bg-teal-700"
        } text-white font-medium py-2 px-4 rounded-md transition`}
      >
        {loading ? "Processing..." : submitButtonText}
      </button>
    </form>
  );
};

export default ProductForm;
