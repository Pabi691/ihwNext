import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import axios from "@/content/axios";
import { FaHeart, FaArrowRight, FaTag } from "react-icons/fa6";
import { ENV } from "@/config/env";

function ProductCard({ product }) {
  const salePrice = parseFloat(product.sale_price || 0);
  const regularPrice = parseFloat(product.regular_price || 0);
  const discount = regularPrice > salePrice
    ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
    : 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex-shrink-0 w-[170px] md:w-[200px] lg:w-[220px]"
    >
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.primary_img}
            alt={product.prod_name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={e => { e.currentTarget.src = "/images/noimage.jpg"; }}
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
          {product.product_tag && (
            <span className="absolute top-2 right-2 bg-[#ef7f1a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {product.product_tag}
            </span>
          )}
          {/* Wishlist */}
          <button className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50">
            <FaHeart className="w-3.5 h-3.5 text-gray-400 hover:text-red-500 transition-colors" />
          </button>
        </div>

        {/* Info */}
        <div className="p-3">
          {product.brand_name && (
            <p className="text-[#04A9FF] text-[10px] font-bold uppercase tracking-wider mb-0.5">{product.brand_name}</p>
          )}
          <h3 className="text-gray-900 text-xs font-bold leading-tight line-clamp-2 mb-2">{product.prod_name}</h3>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-900 font-black text-sm">₹{salePrice.toLocaleString("en-IN")}</span>
              {discount > 0 && (
                <span className="text-gray-400 text-xs line-through ml-1.5">₹{regularPrice.toLocaleString("en-IN")}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-[170px] md:w-[200px] lg:w-[220px] rounded-2xl overflow-hidden border border-gray-100">
      <div className="aspect-square bg-gray-100 animate-pulse" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-100 rounded animate-pulse" />
        <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  );
}

export default function NProductSlider({ slugName, title, subtitle, accentWord }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get(`${ENV.API_URL}/api/v1/${slugName}`);
      const list = res.data?.products || [];
      setProducts(list.slice(0, 12));
    } catch {}
    setLoading(false);
  }, [slugName]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const titleParts = accentWord
    ? title.split(accentWord)
    : [title, ""];

  return (
    <section className="py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            {subtitle && <span className="text-[#04A9FF] text-xs font-bold uppercase tracking-widest">{subtitle}</span>}
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-1">
              {accentWord ? (
                <>{titleParts[0]}<span className="text-[#04A9FF]">{accentWord}</span>{titleParts[1]}</>
              ) : title}
            </h2>
          </div>
          <Link href="/shop" className="inline-flex items-center gap-2 text-[#04A9FF] font-bold text-sm hover:gap-3 transition-all">
            Shop All <FaArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((p, i) => <ProductCard key={p.id || i} product={p} />)}
        </div>
      </div>
    </section>
  );
}
