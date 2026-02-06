import { useState } from "react"
import Script from "next/script"

export default function ReviewPopup() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Floating Review Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed right-[-40px] top-1/2 -translate-y-1/2 rotate-[-90deg]
                   bg-[#04a9ff] text-white py-2 px-4 rounded-md shadow-md
                   z-50 whitespace-nowrap hover:bg-black transition"
      >
        Reviews ⭐
      </button>

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 z-[1000] bg-black/60 flex justify-center items-start overflow-auto">
          
          {/* Modal Box */}
          <div
            className="relative mt-20 w-[80%] max-w-[1000px] bg-white rounded-lg
                       p-4 sm:p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
              aria-label="Close reviews"
            >
              ✕
            </button>

            {/* Elfsight Script */}
            <Script
              src="https://static.elfsight.com/platform/platform.js"
              strategy="afterInteractive"
            />

            {/* Elfsight Widget */}
            <div
              className="elfsight-app-d1d86a1c-77b2-4f8d-8ae0-c7087fc01e9a"
              data-elfsight-app-lazy
            />
          </div>
        </div>
      )}
    </>
  )
}
