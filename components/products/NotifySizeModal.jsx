import React from 'react';

function NotifySizeModal({
  open,
  setOpen,
  variations,
  selected,
  setSelected,
}) {
  if (!open) return null;

  return (
    <div className="openPopup mt-4">
      <div className="flex justify-between">
        <p>Couldn't find your size?</p>
        <button onClick={() => setOpen(false)}>✕</button>
      </div>

      {variations
        .filter(v => v.stock_qty === 0 && v.size)
        .map(size => (
          <label key={size.id} className="border px-3 py-1 mr-2">
            <input
              type="radio"
              hidden
              onChange={() => setSelected(size.id)}
            />
            {size.size}
          </label>
        ))}

      <button
        disabled={!selected}
        className="block mt-3 bg-orange-500 text-white px-3 py-2 rounded"
      >
        Notify Me
      </button>
    </div>
  );
}

export default NotifySizeModal;
