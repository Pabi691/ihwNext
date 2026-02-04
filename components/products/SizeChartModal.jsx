import React from 'react';

function SizeChartModal({ open, onClose, image }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-2">
        <button onClick={onClose} className="block ml-auto">✕</button>
        <img src={image} alt="size-chart" className="w-[450px]" />
      </div>
    </div>
  );
}

export default SizeChartModal;
