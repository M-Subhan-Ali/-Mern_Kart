"use client";

import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";

const ProductForm = ({
  initialData,
  onSubmit,
  loading,
  submitButtonText,
}) => {

  const [isInitialized, setIsInitialized] = useState(false);

  const [formData, setFormData] = useState(() => ({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    category: initialData?.category || "",
    stock: initialData?.stock || "",
    existingImages: initialData?.images || [],
  }));

  const [newImages, setNewImages] = useState([]);

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
  }, [initialData,isInitialized]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewImages(Array.from(e.target.files));
  };

  // 👇 NEW: Handler to remove an existing image
  const handleRemoveExistingImage = (imageUrlToRemove) => {
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter(
        (url) => url !== imageUrlToRemove
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Append all text fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "existingImages") {
        data.append(key, value);
      }
    });

    data.append("existingImagesToKeep", JSON.stringify(formData.existingImages));


    newImages.forEach((file) => data.append("images", file));

    try {
      await onSubmit(data);

      if (!initialData) {
        setFormData({
          title: "",
          description: "",
          price: "",
          category: "",
          stock: "",
          existingImages: []
        });
        setNewImages([]);
      }
    } catch (err) {
      console.error("❌ Error submitting product:", err);
      throw err;
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
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
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
        <label className="block text-sm font-medium text-gray-700">Category</label>
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

      {/* Images Upload for New/Existing */}
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

      {/* Image Preview - Existing Images (for edit) */}
      {formData.existingImages.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          <p className="w-full text-sm text-gray-500">Existing Images (click to remove):</p>
          {formData.existingImages.map((imageUrl, i) => (
            // 👇 NEW: Wrap image in a container with a delete button
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

      {/* Image Preview - New Images */}
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

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full ${loading ? "bg-gray-400" : "bg-teal-600 hover:bg-teal-700"
          } text-white font-medium py-2 px-4 rounded-md transition`}
      >
        {loading ? "Processing..." : submitButtonText}
      </button>
    </form>
  );
};

export default ProductForm;