import React from 'react';

type CartItemProps = {
  item: any;
  onIncrease: (productId: any) => void;
  onDecrease: (productId: any, variationId: any) => void;
  onRemove: (cartId: any) => void;
};

const CartItem = React.memo(({ item, onIncrease, onDecrease, onRemove }: CartItemProps) => (
  <div className="cart-item flex items-start border-b pb-4 mb-4">
    <div className="w-1/4 h-32 mr-4">
      <img
        src={item.primary_img}
        alt={item.prod_name}
        className="w-full h-full object-cover rounded-lg" loading="lazy"
      />
    </div>
    <div className="flex-1">
      <h3 className="text-md font-semibold">{item.prod_name}</h3>
      <p className="text-gray-600 text-sm">Ships in 2-3 days</p>
      {item.variation_name && (
        <p className="text-gray-600 text-sm">Size: {item.variation_name}</p>
      )}
      <div className="flex items-center mt-2">
        <button
          onClick={() => onDecrease(item.product_id, item.prod_variation_id)}
          className="px-2 py-1 text-gray-700 bg-gray-200 rounded"
        >
          -
        </button>
        <span className="px-4">{item.quantity}</span>
        <button
          onClick={() => onIncrease(item.product_id)}
          className="px-2 py-1 text-gray-700 bg-gray-200 rounded"
        >
          +
        </button>
      </div>
      <div className="flex items-center gap-2 text-sm font-bold my-2">
        <p className="text-black">₹{item.sale_price * item.quantity}</p>
        {item.regular_price && (
          <p className="text-gray-500 line-through">
            ₹{item.regular_price * item.quantity}
          </p>
        )}
      </div>
      {item.regular_price > item.sale_price && (
        <p className="text-green-500">
          You saved ₹{(item.regular_price - item.sale_price) * item.quantity}
        </p>
      )}
      <button
        onClick={() => onRemove(item.id)}
        className="text-red-500 text-sm underline mt-2"
      >
        Remove from Cart
      </button>
    </div>
  </div>
));

export default CartItem;
