import { useState, useEffect } from "react";
import axios from "axios";
import { useRedirectWithLoader } from "./useRedirectWithLoader";
import Loader from "./Loader"; // Animated loader

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  const { loading: redirectLoading, redirect } = useRedirectWithLoader();

  // Fetch products
  const fetchProducts = async (pageNumber = 0, size = 8) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/products?page=${pageNumber}&size=${size}`
      );
      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);
      setPage(response.data.number);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page, pageSize);
  }, [page, pageSize]);

  const handlePageChange = (newPage) => {
    setLoading(true);
    setTimeout(() => setPage(newPage), 500);
  };

  const handlePageSizeChange = (size) => {
    setLoading(true);
    setTimeout(() => {
      setPageSize(size);
      setPage(0);
    }, 200);
  };

  // Show Loader overlay during fetching or redirect
  const isLoading = loading || redirectLoading;

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-800">
      {/* Loader Overlay */}
      {isLoading && <Loader />}

      {/* Dim content when loader is active */}
      <div className={isLoading ? "opacity-30 pointer-events-none" : ""}>
        {/* Navigation */}
        <nav className="bg-white/25 sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-4 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() => redirect("/")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10
                     10-4.477 10-10S17.523 2 12 2zM12 7a1 1 0 100 2
                     1 1 0 000-2zm0 4c-2.21 0-4 1.79-4 4h8c0-2.21-1.79-4-4-4z"
                />
                <circle cx="18" cy="6" r="1" fill="currentColor" />
              </svg>
              <span className="text-2xl font-bold text-white">ClearSkinAI</span>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search products..."
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-400 transition-all"
              />
            </div>
          </div>
        </nav>

        {/* Product List */}
        <div className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-8 animate-bounce-slow">
            Skin Care Products
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.productId}
                className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg overflow-hidden transform transition-all hover:-translate-y-2 hover:shadow-2xl flex flex-col"
              >
                <img
                  src={product.productImageLink}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-semibold text-primary-800 dark:text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                    {product.productDescription}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">
                    Skin Type: {product.skinType}
                  </p>
                  <a
                    href={product.productLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto w-full text-center bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    View Product
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="mt-8 flex justify-end items-center space-x-4 text-white">
            <div>
              Page: {page + 1} / {totalPages}
            </div>
            <button
              disabled={page <= 0}
              onClick={() => handlePageChange(page - 1)}
              className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={page + 1 >= totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
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
      </div>
    </div>
  );
};

export default Product;
