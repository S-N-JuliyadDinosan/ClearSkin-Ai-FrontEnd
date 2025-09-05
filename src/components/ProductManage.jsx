import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductManage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(() => {
    return parseInt(localStorage.getItem("pageSize")) || 8;
  });
  const [totalPages, setTotalPages] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products
  const fetchProducts = async (pageNumber = page, size = pageSize) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/products?page=${pageNumber}&size=${size}`
      );
      setProducts(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
      setPage(pageNumber);
      setPageSize(size);
    } catch (err) {
      toast.error("Failed to fetch products");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const confirmDelete = (product) => {
    setSelectedProduct(product);
    setShowConfirm(true);
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/products/${selectedProduct.productId}`
      );
      toast.success("Deleted Product Successfully");
      fetchProducts(page, pageSize);
    } catch (err) {
      toast.error("Failed to delete product");
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
      setShowConfirm(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-800">
      {/* Fullscreen Loader */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
          <Loader />
        </div>
      )}

      <ToastContainer position="top-right" theme="colored" />

      {/* Show content only when not loading */}
      {!loading && (
        <>
          {/* Confirm Delete Modal */}
          {showConfirm && selectedProduct && (
            <div className="fixed inset-0 z-40 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowConfirm(false)}
              ></div>

              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-[90%] max-w-md p-6 z-50 text-center">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
                  Delete Product
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">{selectedProduct.name}</span>?
                </p>

                <div className="mt-6 flex justify-center gap-4">
                  <button
                    className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
                    onClick={() => setShowConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleDeleteProduct}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navbar */}
          <nav className="bg-white/25 sticky top-0 z-50 px-6 py-4 backdrop-blur-lg flex justify-between items-center">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
              onClick={() => window.location.assign("/admin-dashboard/products/add")}
            >
              Add Product
            </button>
          </nav>

          {/* Products Grid */}
          <div className="flex-1 py-16 px-6">
            <h1 className="text-4xl font-bold text-white mb-8">Manage Products</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div
                  key={product.productId}
                  className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg overflow-hidden flex flex-col"
                >
                  <img
                    src={product.productImageLink}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-semibold dark:text-white mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                      {product.productDescription}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">
                      Skin Type: {product.skinType}
                    </p>

                    <div className="mt-auto flex justify-between gap-2">
                      <button
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm"
                        onClick={() =>
                          window.location.assign(
                            `/admin-dashboard/products/edit/${product.productId}`
                          )
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm"
                        onClick={() => confirmDelete(product)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-end items-center space-x-4 text-white">
              <div>
                Page: {page + 1} / {totalPages}
              </div>

              <button
                disabled={page <= 0}
                onClick={() => fetchProducts(page - 1, pageSize)}
                className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <button
                disabled={page + 1 >= totalPages}
                onClick={() => fetchProducts(page + 1, pageSize)}
                className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>

              <select
                value={pageSize}
                onChange={(e) => {
                  const newSize = parseInt(e.target.value);
                  localStorage.setItem("pageSize", newSize);
                  fetchProducts(0, newSize); // reset to first page
                }}
                className="px-2 py-1 rounded bg-gray-700 text-white"
              >
                {[4, 8, 12, 16].map((size) => (
                  <option key={size} value={size}>
                    {size} / page
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductManage;
