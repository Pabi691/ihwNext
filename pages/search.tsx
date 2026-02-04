// @ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "@/components/compat/router";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { useGlobal } from "../global/GlobalContext";
import MainLayOut from "../layout/MainLayOut";
import { FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { themeBgColor } from "../styles/typography";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useGlobal();

  const fetchAllProducts = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get_active_products`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.products || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }, [token]);

  const fetchSearchResults = useCallback(async (searchQuery) => {
    setLoading(true);
    try {
      const allProducts = await fetchAllProducts();
      const filtered = allProducts.filter(product =>
        product.prod_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchAllProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query.trim()}`);
      fetchSearchResults(query.trim());
    }
  };

  const handleSuggestionClick = (text) => {
    setQuery(text);
    navigate(`/search?q=${text}`);
    fetchSearchResults(text);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("q");
    if (searchQuery) {
      setQuery(searchQuery);
      fetchSearchResults(searchQuery);
    }
  }, [location, fetchSearchResults]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.length > 1) {
        const allProducts = await fetchAllProducts();
        const matches = allProducts
          .filter(product =>
            product.prod_name.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 6);
        setSuggestions(matches);
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [query, fetchAllProducts]);

  return (
    <MainLayOut>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Floating Search */}
        <div className="relative">
          <form
            onSubmit={handleSearch}
            className="flex shadow-md border rounded-full px-4 py-2 items-center bg-white focus-within:ring-2 ring-black transition"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for amazing products..."
              className="flex-1 outline-none px-2 py-1 text-sm md:text-base"
            />
            <button type="submit" className="text-black hover:text-primary">
              <FaSearch size={18} />
            </button>
          </form>

          {/* Suggestion Dropdown */}
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute top-full mt-1 w-full bg-white shadow-lg rounded-md z-10"
              >
                {suggestions.map((item) => (
                  <li
                    key={item.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleSuggestionClick(item.prod_name)}
                  >
                    {item.prod_name}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Results */}
        <div className="mt-10">
          {loading ? (
            <p className="text-center text-gray-500">Searching...</p>
          ) : searchResults.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {searchResults.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center mt-20 h-screen">
  <div className="text-5xl mb-4">😕</div>
  <h2 className="text-xl font-semibold text-gray-700">No results found</h2>
  <p className="text-gray-500 mt-2">
    We couldn’t find anything matching <strong>"{query}"</strong>
  </p>
  <button
    onClick={() => setQuery("")}
    className={`mt-6 px-6 py-2 ${themeBgColor} text-white rounded-full hover:bg-gray-800 transition`}
  >
    Clear Search
  </button>
</div>

          )}
        </div>
      </div>
    </MainLayOut>
  );
};

export default SearchPage;


