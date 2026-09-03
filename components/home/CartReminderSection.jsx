import React from 'react';
import { Link } from '@/components/compat/router';
import { useGlobal } from '../../global/GlobalContext';

export default function CartReminderSection() {
  const { cart, token } = useGlobal();

  // Only show for logged-in users with items in cart
  if (!token || !Array.isArray(cart) || cart.length === 0) return null;

  const subtotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.sale_price || item.price || item.regular_price || 0);
    return sum + price * (item.quantity || 1);
  }, 0);

  return (
    <section className="py-8 md:py-10 bg-gradient-to-r from-[rgb(var(--site-primary-rgb)_/_0.05)] to-blue-50 border-y border-blue-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-xs font-semibold text-[var(--site-primary)] uppercase tracking-widest mb-0.5">
              Your Cart
            </p>
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              🛒 You left {cart.length} item{cart.length > 1 ? "s" : ""} behind!
            </h2>
            {subtotal > 0 && (
              <p className="text-sm text-gray-500 mt-0.5">
                Subtotal: <span className="font-bold text-gray-800">₹{subtotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
              </p>
            )}
          </div>
          <Link
            href="/cart"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--site-primary)] hover:bg-[var(--site-primary-hover)] text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
          >
            Complete Purchase →
          </Link>
        </div>

        {/* Horizontal scroll of cart items */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {cart.map((item, i) => {
            const price = parseFloat(item.sale_price || item.price || item.regular_price || 0);
            const mrp   = parseFloat(item.regular_price || 0);
            const disc  = mrp > price && price > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;

            return (
              <Link
                key={item.id || i}
                href={item.slug ? `/product/${item.slug}` : "/cart"}
                className="flex-shrink-0 w-36 sm:w-44 bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-md hover:border-[var(--site-primary)] transition-all group overflow-hidden"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  {item.primary_img ? (
                    <img
                      src={item.primary_img}
                      alt={item.prod_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-[rgb(var(--site-primary-rgb)_/_0.1)]">
                      <span className="text-3xl font-bold text-[rgb(var(--site-primary-rgb)_/_0.2)]">
                        {(item.prod_name || "P")[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  {item.quantity > 1 && (
                    <span className="absolute top-1.5 right-1.5 bg-[var(--site-primary)] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  )}
                  {disc > 0 && (
                    <span className="absolute top-1.5 left-1.5 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-md">
                      -{disc}%
                    </span>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-semibold text-gray-700 line-clamp-2 leading-tight mb-1">
                    {item.prod_name || "Product"}
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-[var(--site-primary)]">
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                    {disc > 0 && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{mrp.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
