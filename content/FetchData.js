// ProductCards.js
import React, { useEffect, useState } from 'react';

function Fetchdata({ apiUrl, renderProduct, children }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          setProducts(data.products);
        }
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiUrl]);

  return (
    <div>
      {renderProduct
        ? products.map((product, index) => (
            <div key={index}>{renderProduct(product)}</div>
          ))
        : children(products)}
    </div>
  );
}

export default Fetchdata;
