import React from 'react';

function ProductHighlights({ highlights }) {
  if (!highlights?.length) return null;

  return (
    <div className="mt-6">
      <h2 className="font-medium mb-2">Key Highlights</h2>
      <div className="flex flex-wrap gap-2">
        {highlights.map((h, i) => (
          <div key={i} className="w-[47%]">
            <p className="text-gray-400 text-xs">{h.label}</p>
            <p className="font-medium">{h.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductHighlights;
