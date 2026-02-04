import React from "react";
import { Link } from "@/components/compat/router";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card border rounded-md p-4 shadow hover:shadow-lg transition">
      <Link to={`../product/${product.slug}`}>
        <img
          src={product.primary_img}
          alt={product.prod_name}
          className="w-full h-48 object-cover mb-4 rounded-md" loading="lazy"
        />
      </Link>
      <Link to={`../product/${product.slug}`}><h2 className="text-lg font-semibold mb-2">{product.prod_name}</h2></Link>
      <p className="text-gray-600 mb-4">{product.prod_desc.slice(0, 100)}...</p>
      <div className="flex items-center justify-between">
        <span className="text-black font-bold">₹{product.sale_price}</span>
        {product.sale_price !== product.regular_price && (
          <span className="line-through text-gray-500 text-sm">
            ₹{product.regular_price}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

