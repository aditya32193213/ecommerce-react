/**
 * Home Component
 * --------------
 * File: Home.jsx
 * Purpose: Acts as the landing page of the e-commerce app. 
 *
 * Features:
 *  - Fetches product categories and product listings from API
 *  - Allows filtering products by category
 *  - Supports debounced search with highlighted matches in product titles
 *  - Displays loading spinner while fetching data
 *  - Integrates scroll animations using AOS (Animate on Scroll)
 *  - Links each product to a detailed product page
 *  - Shows "What We Believe" informational section at the bottom
 */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import AOS from "aos";
import "aos/dist/aos.css";
import useDebounce from "../hooks/useDebounce";
import ClipLoader from "react-spinners/ClipLoader";
import WhatWeBelieve from "../components/sections/whatwebelieve";

const Home = () => {
  // ----------------------------
  // Local State
  // ----------------------------
  const [products, setProducts] = useState([]); // List of products
  const [categories, setCategories] = useState([]); // List of product categories
  const [selectedCategory, setSelectedCategory] = useState("all"); // Current filter
  const [loading, setLoading] = useState(true); // Loader state

  // Redux state for search query, debounced for better performance
  const rawSearchQuery = useSelector((state) => state.search.query);
  const searchQuery = useDebounce(rawSearchQuery, 300);

  /**
   * highlightMatch
   * --------------
   * Highlights the search term inside product titles
   * Example: "iPhone Pro" with query "pro" → iPhone <mark>Pro</mark>
   */
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
        <span data-testid="highlighted-text" className="bg-yellow-200">
          {match}
        </span>
        {after}
      </>
    );
  };

  // ----------------------------
  // Effects
  // ----------------------------

  // Initialize scroll animations
  useEffect(() => {
    AOS.init({ duration: 600, once: false });
  }, []);

  // Fetch categories and products from API
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

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Refresh AOS animations when products update
  useEffect(() => {
    AOS.refresh();
  }, [products]);

  // ----------------------------
  // Filtering Logic
  // ----------------------------
  const filteredProducts = products
    .filter((product) =>
      selectedCategory === "all" ? true : product.category === selectedCategory
    )
    .filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <div
      data-testid="home-page"
      className="min-h-screen bg-fixed bg-center bg-cover bg-no-repeat"
    >
      <div className="bg-white/80 backdrop-blur-sm min-h-screen p-6">
        {/* Categories Section */}
        <h2 className="text-2xl font-bold mb-4" data-testid="category-title">
          Categories
        </h2>
        <div
          data-testid="category-buttons"
          className="flex flex-wrap gap-3 mb-6"
        >
          {/* "All" Button */}
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

          {/* Dynamic category buttons */}
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

        {/* Products Section */}
        <h2 className="text-2xl font-bold mb-4" data-testid="products-title">
          Products
        </h2>

        {loading ? (
          // Show spinner while fetching
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
            {/* Render product cards */}
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                data-testid={`product-${product.id}`}
                data-aos="fade-up"
                data-aos-delay={100}
                className="border p-4 rounded shadow bg-white"
              >
                {/* Product Image */}
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-40 mx-auto object-contain mb-3"
                  data-testid={`product-image-${product.id}`}
                />

                {/* Product Title with highlighted search match */}
                <h3
                  className="font-medium line-clamp-2"
                  data-testid={`product-title-${product.id}`}
                >
                  {highlightMatch(product.title, searchQuery)}
                </h3>

                {/* Product Price */}
                <p
                  className="text-green-700 font-bold"
                  data-testid={`product-price-${product.id}`}
                >
                  ${product.price}
                </p>

                {/* Product Category */}
                <p
                  className="text-sm mt-1 text-gray-600 capitalize"
                  data-testid={`product-category-${product.id}`}
                >
                  {product.category}
                </p>
              </Link>
            ))}

            {/* Show message if no products match search */}
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

        {/* Informational Section */}
        <div className="mt-16" data-testid="belief-section">
          <WhatWeBelieve />
        </div>
      </div>
    </div>
  );
};

export default Home;
