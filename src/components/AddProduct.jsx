import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRedirectWithLoader } from "./useRedirectWithLoader";
import Loader from "./Loader";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    productLink: "",
    productImageLink: "",
    productDescription: "",
    skinType: "",
  });
  const [saving, setSaving] = useState(false);

  const { loading: redirectLoading, redirect } = useRedirectWithLoader();

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Delete image handler
  const handleDeleteImage = () => {
    setFormData((prev) => ({ ...prev, productImageLink: "" }));
    toast.info("Image removed. Please add a new one.");
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post("http://localhost:8082/api/v1/products", formData);
      toast.success("Product added successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });

      // redirect with loader
      setTimeout(() => {
        redirect("/product-manage", 1200);
      }, 1200);
    } catch (error) {
      console.error("Failed to save product:", error);
      toast.error("Failed to add product. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setSaving(false);
    }
  };

  const isLoading = saving || redirectLoading;

  return (
    <div className="relative bg-gray-100 dark:bg-gray-900 min-h-screen flex justify-center items-center">
      {/* Loader overlay */}
      {isLoading && <Loader />}

      {/* Dim background when loading */}
      <div className={isLoading ? "opacity-30 pointer-events-none" : ""}>
        <div className="w-full max-w-3xl mx-auto p-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Add Product
            </h1>

            <form onSubmit={handleSubmit}>
              {/* Product Info Section */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">
                  Product Information
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-gray-700 dark:text-white mb-1"
                    >
                      Product Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border py-2 px-3 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="brand"
                      className="block text-gray-700 dark:text-white mb-1"
                    >
                      Brand
                    </label>
                    <input
                      type="text"
                      id="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border py-2 px-3 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="productDescription"
                    className="block text-gray-700 dark:text-white mb-1"
                  >
                    Description
                  </label>
                  <input
                    type="text"
                    id="productDescription"
                    value={formData.productDescription}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border py-2 px-3 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* IMAGE SECTION */}
                <div className="mt-4">
                  <label
                    htmlFor="productImageLink"
                    className="block text-gray-700 dark:text-white mb-1"
                  >
                    Product Image
                  </label>
                  {formData.productImageLink ? (
                    <div className="relative inline-block">
                      <img
                        src={formData.productImageLink}
                        alt="Product"
                        className="w-48 h-48 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={handleDeleteImage}
                        className="absolute bottom-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded shadow hover:bg-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <input
                      type="text"
                      id="productImageLink"
                      placeholder="Add the Product image URL"
                      value={formData.productImageLink}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border py-2 px-3 dark:bg-gray-700 dark:text-white"
                    />
                  )}
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="productLink"
                    className="block text-gray-700 dark:text-white mb-1"
                  >
                    Product Link
                  </label>
                  <input
                    type="text"
                    id="productLink"
                    value={formData.productLink}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border py-2 px-3 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="skinType"
                    className="block text-gray-700 dark:text-white mb-1"
                  >
                    Skin Type
                  </label>
                  <input
                    type="text"
                    id="skinType"
                    value={formData.skinType}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Dry, Oily, Combination"
                    className="w-full rounded-lg border py-2 px-3 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-900 disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AddProduct;
