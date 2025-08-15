// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import AOS from "aos";
import "aos/dist/aos.css";
import useDebounce from "../hooks/useDebounce";
import ClipLoader from "react-spinners/ClipLoader";
import WhatWeBelieve from "../components/sections/whatwebelieve";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const rawSearchQuery = useSelector((state) => state.search.query);
  const searchQuery = useDebounce(rawSearchQuery, 300);

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const matchIndex = lowerText.indexOf(lowerQuery);
    if (matchIndex === -1) return text;
    const before = text.slice(0, matchIndex);
    const match = text.slice(matchIndex, matchIndex + query.length);
    const after = text.slice(matchIndex + query.length);
    return (
      <>
        {before}
        <span data-testid="highlighted-text" className="bg-yellow-200">{match}</span>
        {after}
      </>
    );
  };

  useEffect(() => {
    AOS.init({ duration: 600, once: false });
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, prodRes] = await Promise.all([
        fetch("https://fakestoreapi.com/products/categories"),
        fetch("https://fakestoreapi.com/products"),
      ]);
      const [catData, prodData] = await Promise.all([
        catRes.json(),
        prodRes.json(),
      ]);
      setCategories(catData);
      setProducts(prodData);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [products]);

  const filteredProducts = products
    .filter((product) =>
      selectedCategory === "all" ? true : product.category === selectedCategory
    )
    .filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div
      data-testid="home-page"
      className="min-h-screen bg-fixed bg-center bg-cover bg-no-repeat"
    >
      <div className="bg-white/80 backdrop-blur-sm min-h-screen p-6">
        <h2 className="text-2xl font-bold mb-4" data-testid="category-title">
          Categories
        </h2>
        <div
          data-testid="category-buttons"
          className="flex flex-wrap gap-3 mb-6"
        >
          <button
            data-testid="category-all"
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded ${
              selectedCategory === "all"
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              data-testid={`category-${category}`}
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`capitalize px-4 py-2 rounded ${
                selectedCategory === category
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4" data-testid="products-title">
          Products
        </h2>

        {loading ? (
          <div
            data-testid="loading-spinner"
            className="flex justify-center items-center h-64"
          >
            <ClipLoader size={48} color="#FACC15" />
          </div>
        ) : (
          <div
            data-testid="product-list"
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                data-testid={`product-${product.id}`}
                data-aos="fade-up"
                data-aos-delay={100}
                className="border p-4 rounded shadow bg-white"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-40 mx-auto object-contain mb-3"
                  data-testid={`product-image-${product.id}`}
                />
                <h3
                  className="font-medium line-clamp-2"
                  data-testid={`product-title-${product.id}`}
                >
                  {highlightMatch(product.title, searchQuery)}
                </h3>
                <p
                  className="text-green-700 font-bold"
                  data-testid={`product-price-${product.id}`}
                >
                  ${product.price}
                </p>
                <p
                  className="text-sm mt-1 text-gray-600 capitalize"
                  data-testid={`product-category-${product.id}`}
                >
                  {product.category}
                </p>
              </Link>
            ))}

            {searchQuery && filteredProducts.length === 0 && (
              <p
                data-testid="no-products"
                className="text-red-500 font-semibold text-center col-span-full"
              >
                No products match your search.
              </p>
            )}
          </div>
        )}

        <div className="mt-16" data-testid="belief-section">
          <WhatWeBelieve />
        </div>
      </div>
    </div>
  );
};

export default Home;
