import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const [bgLoaded, setBgLoaded] = useState(false);
  const navigate = useNavigate();

  // Preload background image
  useEffect(() => {
    const img = new Image();
    img.src =
      "https://res.cloudinary.com/dkt1t22qc/image/upload/v1742348950/Prestataires_Documents/fopt5esl9cgvlcawz1z4.jpg";
    img.onload = () => setBgLoaded(true);
  }, []);

  if (!bgLoaded) {
    return (
      <div className="h-screen w-screen flex justify-center items-center bg-gray-800 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dkt1t22qc/image/upload/v1742348950/Prestataires_Documents/fopt5esl9cgvlcawz1z4.jpg')",
      }}
    >
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() => navigate("/")}
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
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-primary-800 dark:text-white mb-8 animate-bounce-slow">
            Featured Collection
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Product Cards */}
            {[
              {
                img: "https://res.cloudinary.com/djv4xa6wu/image/upload/v1735722165/AbhirajK/Abhirajk.webp",
                title: "Casual Wear",
                price: "₹99.99",
                tag: "New",
                tagColor: "bg-primary-100 text-primary-800",
              },
              {
                img: "https://res.cloudinary.com/djv4xa6wu/image/upload/v1735722163/AbhirajK/Abhirajk%20mykare.webp",
                title: "Summer Collection",
                price: "₹79.99",
                tag: "Sale",
                tagColor: "bg-green-100 text-green-800",
              },
              {
                img: "https://res.cloudinary.com/djv4xa6wu/image/upload/v1735722161/AbhirajK/Abhirajk2.webp",
                title: "Winter Special",
                price: "₹129.99",
                tag: "Limited",
                tagColor: "bg-blue-100 text-blue-800",
              },
              {
                img: "https://res.cloudinary.com/djv4xa6wu/image/upload/v1735722160/AbhirajK/Abhirajk4.webp",
                title: "Premium Collection",
                price: "₹199.99",
                tag: "Premium",
                tagColor: "bg-purple-100 text-purple-800",
              },
            ].map((product, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg overflow-hidden transform transition-all hover:-translate-y-2 hover:shadow-2xl"
              >
                <img
                  src={product.img}
                  alt={product.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-primary-800 dark:text-white">
                    {product.title}
                  </h3>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-primary-600 font-bold">{product.price}</p>
                    <span
                      className={`${product.tagColor} px-2 py-1 rounded-full text-xs`}
                    >
                      {product.tag}
                    </span>
                  </div>
                  <button className="mt-4 w-full bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
