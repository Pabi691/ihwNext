import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "@/components/compat/router";
// import axios from "axios";
import { useGlobal } from "../global/GlobalContext";
import API_BASE_URL from "../global/apiConfig";
import WishlistButton from "./WishlistButton";
import NotFound from "./common/NotFound";
import { BiChevronRight, BiSortAZ } from "react-icons/bi";
import { CheckIcon, SortDescIcon } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import compressImage from "../utils/compressImage";
import { themeBgColor } from "../styles/typography";

function ProductPageBody({ categorySlug, ProductsCount = null, products, catagoryProducts }) {

  const { token, wishlist, setWishlist } = useGlobal();
  // const [products, setProducts] = useState([]);
  // const [catagoryProducts, setCatagoryProducts] = useState([]);
  const [sortOption, setSortOption] = useState("popularity");
  const [isOpen, setIsOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ size: [], brand: [], color_id: [], category: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const location = useLocation();
  // const [activeFilter, setActiveFilter] = useState(null);
  const [showAllSizes, setShowAllSizes] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllColors, setShowAllColors] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      let filtered = [];

      const sourceProducts =
        catagoryProducts.products?.length > 0
          ? catagoryProducts.products
          : products?.products;

      if (Array.isArray(sourceProducts)) {
        filtered = sourceProducts.filter((product) => {
          const matchesSize =
            !filters.size.length ||
            product.product_variations?.some((v) => filters.size.includes(v.size));

          const matchesBrand =
            !filters.brand.length || filters.brand.includes(product.brand_details?.brand_name);

          const matchesColor =
            !filters.color_id.length || (product.color_id && filters.color_id.includes(product.color_id));

          const matchesCategory =
            !filters.category.length || // No filter applied → show all
            product.product_categories?.some((v) => filters.category.includes(v.category_name));
          return matchesSize && matchesBrand && matchesColor && matchesCategory;
        });
      }

      setFilteredProducts(filtered);
      setLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [filters, products, catagoryProducts]);

  const filterColor = useCallback(async () => {

    // Use category products if available, otherwise use all products
    const sourceProducts = catagoryProducts.products?.length > 0 ? catagoryProducts.products : products?.products;
    const uniqueColorsMap = new Map();
    sourceProducts?.forEach((product) => {
      const color = product?.color_details;
      if (color?.id) {
        uniqueColorsMap.set(color.id, {
          color_id: Number(color.id),
          color_name: color.color_code.startsWith("#") ? color.color_code : color.color_code.toLowerCase(),
        });
      }

    });

    const uniqueColors = Array.from(uniqueColorsMap.values());
    // // console.log("Extracted Colors:", uniqueColors); // Ensure colors are being set correctly
    setColors(uniqueColors);
  }, [catagoryProducts.products, products?.products]);

  const filterSizes = useCallback(async () => {
    // Use category products if available, otherwise use all products
    const sourceProducts = catagoryProducts.products?.length > 0 ? catagoryProducts.products : products?.products;
    const uniqueSizesMap = new Map();
    sourceProducts?.forEach((product) => {
      product.product_variations.forEach((variation) => {
        if (variation?.size_id && variation?.size) {
          uniqueSizesMap.set(variation.size_id, {
            size_id: Number(variation.size_id),
            size: variation.size ? variation.size : variation.size.toLowerCase(),
          });
        }
      });
    });

    const uniqueSizes = Array.from(uniqueSizesMap.values());
    // // console.log("Extracted Sizes:", uniqueSizes); // Ensure colors are being set correctly
    setSizes(uniqueSizes);
  }, [catagoryProducts.products, products?.products]);

  const filterBrands = useCallback(async () => {
    // Use category products if available, otherwise use all products
    const sourceProducts = catagoryProducts.products?.length > 0 ? catagoryProducts.products : products?.products;
    const uniqueBrandsMap = new Map();
    sourceProducts?.forEach((brand) => {
      const b = brand?.brand_details;
      if (b?.id) {
        uniqueBrandsMap.set(b.id, {
          brand_id: Number(b.id),
          brand_name: b.brand_name ? b.brand_name : b.brand_name.toLowerCase(),
        });
      }
    });

    const uniqueBrands = Array.from(uniqueBrandsMap.values());
    // // console.log("Extracted Brands:", uniqueBrands); // Ensure colors are being set correctly
    setBrands(uniqueBrands);
  }, [catagoryProducts.products, products?.products]);

  const filterCategory = useCallback(async () => {
    // Use category products if available, otherwise use all products
    const sourceProducts = catagoryProducts.products?.length > 0 ? catagoryProducts.products : products?.products;
    // // console.log('sourceProducts', sourceProducts);
    const uniqueCategoryMap = new Map();
    sourceProducts?.forEach((cat) => {
      cat.product_categories.forEach((variation) => {
        if (variation?.id && variation?.category_name) {
          uniqueCategoryMap.set(variation.id, {
            category_id: Number(variation.id),
            category: variation.category_name ? variation.category_name : variation.category_name.toLowerCase(),
            category_slug: variation.slug,
            updated_at: cat.updated_at,
            sale_price: cat.sale_price,
            rating: cat.product_rating
          });
        }
      });
    });

    const uniqueCategories = Array.from(uniqueCategoryMap.values());
    // console.log("Extracted Categories:", uniqueCategories); // Ensure colors are being set correctly
    setCategories(uniqueCategories);
  }, [catagoryProducts.products, products?.products]);

  const handleSortChange = (event) => {
    const selectedSort = event.target.value;
    setSortOption(selectedSort);
    setIsOpen(false);

    let sortedProducts = [...filteredProducts];

    if (selectedSort === "popularity") {
      sortedProducts.sort((a, b) => Number(b.rating) - Number(a.rating));
    } else if (selectedSort === "newArrival") {
      sortedProducts.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    } else if (selectedSort === "priceLowToHigh") {
      sortedProducts.sort((a, b) => parseFloat(a.sale_price) - parseFloat(b.sale_price));
    } else if (selectedSort === "priceHighToLow") {
      sortedProducts.sort((a, b) => parseFloat(b.sale_price) - parseFloat(a.sale_price));
    }
    setFilteredProducts(sortedProducts); // Update state once, no loop
  };

  const sortOptions = [
    { value: "popularity", label: "Popularity" },
    { value: "newArrival", label: "New Arrival" },
    { value: "priceLowToHigh", label: "Price: Low to High" },
    { value: "priceHighToLow", label: "Price: High to Low" }
  ];
  const selectedLabel = sortOptions.find(option => option.value === sortOption)?.label;
  useEffect(() => {
    filterColor();
    filterSizes();
    filterBrands();
    filterCategory();
  }, [filterColor, filterSizes, filterBrands, filterCategory]);

  const formattedCategory = categorySlug
    ? catagoryProducts.category_data?.category_name
    : "All Products";

  const toggleFilter = (filterType, value) => {
    setFilters((prevFilters) => {
      if (value === undefined || value === null) return prevFilters; // Prevent adding undefined values

      const currentValues = prevFilters[filterType] || [];
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value) // Remove if already selected
        : [...currentValues, value]; // Add if not selected

      return { ...prevFilters, [filterType]: updatedValues };
    });
  };

  // const toggleFilterMenu = (filterType) => {
  //   setActiveFilter(activeFilter === filterType ? null : filterType);
  // };

  if (!products) {
    return <NotFound />;
  }

  return (
    <div className="product-page-body max-w-8xl mx-auto px-0 md:px-6 lg:px-8 mb-12 mt-4">
      <>
        {/* {ProductsCount={filteredProducts.length} */}
        {ProductsCount ? `${ProductsCount.length}` : ''}
        {/* Breadcrumb */}
        <div className="breadcrumb mb-5 text-gray-500 md:flex items-center gap-4 hidden">
          <Link className="text-sm" to="/">Home</Link> <BiChevronRight />  <span className="uppercase text-sm">{formattedCategory}</span>
        </div>
        {/* <img src={filteredProducts.brand_details?.brand_name} /> */}
        <div className="flex justify-between flex-col md:flex-row">
          {/* Filter Sidebar */}
          <div className="filter sticky w-1/5 top-0 h-fit border-none p-0 md:p-4 border-gray-200 z-[60] md:z-0">
            <div
              className="filterTitle mb-6 text-lg text-black 
            font-medium hidden md:block">
              Filters
            </div>
            <button onClick={() => setOpenFilter(true)}
              className="filterTitle text-lg text-black flex items-center gap-3 justify-center py-1 border-r border-black
              font-medium fixed bottom-0 left-0 bg-white w-1/2 text-center md:hidden z-[70] md:z-0">
              <BiSortAZ />  Filters
            </button>
            <hr />
            {openFilter && (
              <div className='fixed w-full left-0 top-0 h-screen bg-[#0000003c] z-[75]'></div>
            )}

            <div
              className={`${!openFilter ? 'hidden' : 'fixed'} filterOptions md:flex 
                flex-col gap-4 h-[65vh] md:h-[80vh] overflow-scroll z-[80] md:z-0 bg-white w-full 
                md:w-auto left-0 rounded-ss-3xl rounded-se-2xl md:rounded-none bottom-0
                scrollbar-none pt-4 p-10 md:px-0 md:pb-0`}>
              <div className="flex justify-between items-center md:hidden my-3">
                <div
                  className="filterTitle text-lg text-black font-medium">
                  Filters
                </div>
                <button className={`font-semibold text-xs ${themeBgColor} text-white w-6 h-6 rounded-full`} onClick={() => setOpenFilter(false)}>✕</button>
              </div>

              {/* Category Filter */}
              {categories && (
                <div className="hidden md:block">
                  <button className="font-semibold mb-3 text-gray-700">Categories</button>
                  <div className="flex flex-col items-start gap-3">
                    {categories.slice(0, showAllCategories ? categories.length : 4).map((cat) => (
                      <button
                        key={cat.category_id}
                        className="border-none flex gap-2 items-baseline text-gray-600 font-medium text-sm text-left hover:text-[#04A9FF]"
                        onClick={() => navigate(`../../${cat.category_slug}`)}
                      >
                        {cat.category}
                      </button>
                    ))}

                    {categories.length > 4 && (
                      <button
                        onClick={() => setShowAllCategories(!showAllCategories)}
                        className="text-[#04A9FF] mt-2 text-xs"
                      >
                        {showAllCategories ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </div>
                </div>
              )}
              <hr />
              {sizes && (
                <div>
                  <li className="font-medium mb-3 text-gray-700">Sizes</li>
                  <div className="flex flex-col ms-5 items-start gap-3">
                    {sizes.slice(0, showAllSizes ? sizes.length : 4).map((sizeObj) => (
                      <button
                        key={sizeObj.size_id}
                        className="border-none flex gap-2 items-baseline hover:text-[#04A9FF]"
                        onClick={() => toggleFilter("size", sizeObj.size)} // Pass size name instead of key
                      >
                        <span className={`filterOption border text-start mb-2 w-4 h-4 flex items-center justify-center
                        ${filters.size.includes(sizeObj.size) ? `${themeBgColor}` : "border-gray-600"
                          }`}>{filters.size.includes(sizeObj.size) && (<CheckIcon className="text-xs" />)}</span>
                        {sizeObj.size}
                      </button>
                    ))}


                    {sizes.length > 4 && (
                      <button
                        onClick={() => setShowAllSizes(!showAllSizes)}
                        className="text-[#04A9FF] mt-2 text-xs"
                      >
                        {showAllSizes ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </div>
                </div>
              )}
              <hr />
              {/* Brand Filter */}
              {brands && (
                <div>
                  <li className="font-medium mb-3 text-gray-700">Brands</li>
                  <div className="flex flex-col ms-5 items-start gap-3">
                    {brands.slice(0, showAllBrands ? brands.length : 4).map((brand) => (
                      <button
                        key={brand.brand_id}
                        className="border-none flex gap-2 items-baseline text-left text-xs hover:text-[#04A9FF]"
                        onClick={() => toggleFilter("brand", brand.brand_name)}
                      >
                        <span className={`filterOption border text-start mb-2 w-4 h-4 ${filters.brand.includes(brand.brand_name) ? themeBgColor : "border-gray-600"
                          }`}></span>
                        {brand.brand_name}
                      </button>
                    ))}

                    {brands.length > 4 && (
                      <button
                        onClick={() => setShowAllBrands(!showAllBrands)}
                        className="text-[#04A9FF] mt-2 text-xs"
                      >
                        {showAllBrands ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </div>
                </div>
              )}
              <hr />
              {/* Color Filter */}
              {colors && (
                <div>
                  <li className="font-bold mb-3 text-gray-700">Colors</li>
                  <div className="flex flex-col ms-5 items-start gap-3">
                    {colors.length > 0 ? (
                      colors
                        .slice(0, showAllColors ? colors.length : 4)
                        .map((color) => (
                          <button
                            key={color.color_id}
                            className="border-none flex gap-2 items-baseline"
                            onClick={() => toggleFilter("color_id", color.color_id)}
                          >
                            {/* Debugging */}

                            {/* Selection Indicator */}
                            <span
                              className={`filterOption border text-start mb-2 w-4 h-4 ${filters.color_id.includes(color.color_id) ? themeBgColor : "border-gray-600"
                                }`}
                            ></span>

                            {/* Color Display */}
                            <span
                              className="w-5 h-5 rounded-full border"
                              style={{ background: color.color_name || "#000000" }}
                            ></span>
                          </button>
                        ))
                    ) : (
                      <p>No colors available</p>
                    )}

                    {colors.length > 4 && (
                      <button
                        onClick={() => setShowAllColors(!showAllColors)}
                        className="text-[#04A9FF] mt-2 text-xs"
                      >
                        {showAllColors ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Product Listing */}

          <div className="all_products w-full md:w-4/5">
            <div className="flex justify-between items-center">
              <div className="gap-3 text-xl mb-5 md:mb-10 items-baseline hidden md:flex">
                <h1 className="font-semibold text-gray-800"><span className="capitalize">{formattedCategory}</span></h1>
                <span className="text-gray-400 text-base hidden md:block"> ({filteredProducts.length} Products)</span>
              </div>
              {/* filter start */}
              <div className={`fixed right-0 bottom-0 md:relative mr-0 md:mr-5 ${openFilter ? 'z-0' : 'z-[60]'} md:z-10`}>
                {/* Selected filter displayed */}
                <div
                  className="flex items-center p-1 md:p-2 border-none md:border border-gray-300 rounded-none 
                  md:rounded-md cursor-pointer gap-2 md:relative fixed text-lg font-medium bottom-0 right-0 
                  z-[60] bg-white w-1/2 md:w-auto"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <SortDescIcon />
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis block max-w-[150px]">
                    {selectedLabel}
                  </span>
                </div>

                {isOpen && (
                  <div className='fixed w-full left-0 top-0 h-screen bg-[#0000003c] z-[70] md:hidden'></div>
                )}

                {/* Popup with all sorting options */}
                {isOpen && (
                  <div className="fixed w-full bottom-0 md:bottom-auto md:absolute right-0 mt-2 bg-white 
                  shadow-md rounded-2xl md:rounded-md border border-gray-300 p-2 md:w-48 z-[75]">
                    <button className={`font-semibold text-xs ${themeBgColor} float-right text-white w-6 h-6 rounded-full`} onClick={() => setIsOpen(false)}>✕</button>
                    {sortOptions.map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100">
                        <input
                          type="radio"
                          name="sort"
                          value={option.value}
                          checked={sortOption === option.value}
                          onChange={handleSortChange}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {/* end of filter */}
            </div>
            {catagoryProducts.category_data?.cat_banner && (
              <img className="w-[99%] my-3 hidden md:block" loading="lazy" alt="cat-banner" src={catagoryProducts.category_data.cat_banner} />
            )}
            <div className="flex flex-wrap gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="item w-[47%] h-[250px] md:w-[32%] bg-white overflow-hidden relative md:h-[365px]"
                >
                  {
                    loading ? (
                      <Skeleton
                        height={400}
                        className="w-[47%] md:w-[32%]" />
                    ) : (
                      <>
                        <Link to={`/product/${product.slug}`} className="relative w-full h-[70%]">
                          <img
                            src={compressImage(product.primary_img, 400, 70, 'webp')}
                            alt={product.prod_name}
                            className="w-full h-full transition-opacity duration-300 ease-in-out object-cover object-top"
                          />
                        </Link>

                        <div className="p-2 md:p-4 absolute bottom-0 w-full bg-white bg-opacity-90">
                          <div className="flex justify-between items-center">
                            {product.brand_details?.brand_name && (
                              <h3 className="text-xs md:text-sm text-gray-900 w-4/5 font-semibold">
                                {product.brand_details.brand_name}
                              </h3>
                            )}
                            <WishlistButton
                              product={product}
                              wishlist={wishlist}
                              setWishlist={setWishlist}
                              token={token}
                              API_BASE_URL={API_BASE_URL}
                            />
                          </div>
                          <h2 className="text-xs md:text-sm text-gray-500 truncate w-4/5 font-semibold">
                            {product.prod_name}
                          </h2>

                          <div className="flex gap-[2px] md:gap-2 items-end mt-1 mb-2">
                            <p className="text-black text-xs md:text-sm font-semibold md:font-bold flex gap-[2px]">
                              <span>₹</span>
                              <span>{product.sale_price}</span>
                            </p>
                            <p className="text-gray-500 text-[11px] line-through md:text-sm flex gap-[2px]">
                              <span>₹</span>
                              <span>{product.regular_price}</span>
                            </p>
                            <p className="text_hightlight font-bold md:text-xs text-[10px]">
                              <span>
                                {(
                                  ((product.regular_price - product.sale_price) / product.regular_price) *
                                  100
                                ).toFixed(2)}{' '}
                              </span>
                              <span>% OFF</span>
                            </p>
                          </div>

                          <div className='flex gap-2 mt-3'>
                            {(product.product_tag && product.product_tag !== 'null') && (
                              <span className='border px-2 py-1 bg-green-400 text-white font-medium uppercase text-[10px] md:text-xs'>
                                {product.product_tag}
                              </span>
                            )}
                            {(product.product_quality && product.product_quality !== 'null') && (
                              <span className='border px-2 py-1 bg-gray-400 text-white font-medium uppercase text-[10px] md:text-xs'>
                                {product.product_quality}
                              </span>
                            )}
                          </div>
                        </div>
                      </>
                    )
                  }
                </div>
              ))}
            </div>

          </div>
        </div>
      </>
    </div>
  )
}

export default ProductPageBody;

