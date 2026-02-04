import { useState, useEffect } from "react";
import { themeBgColor } from "@/styles/typography";

export default function TryAgainButton() {
  const [letterIndex, setLetterIndex] = useState(0);
  const [showRetry, setShowRetry] = useState(false);
  const letters = ["I", "H", "W"];

  useEffect(() => {
    const letterInterval = setInterval(() => {
      setLetterIndex((prevIndex) => (prevIndex + 1) % letters.length);
    }, 500); // Change letter every 500ms

    const retryTimeout = setTimeout(() => {
      setShowRetry(true);
    }, 10000); // Show retry button after 10 sec

    return () => {
      clearInterval(letterInterval);
      clearTimeout(retryTimeout);
    };
  }, [letters.length]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-6xl font-bold animate-bounce">{letters[letterIndex]}</div>
      {showRetry && (
        <button
          className={`mt-5 px-6 py-2 ${themeBgColor} text-white text-lg font-semibold rounded-lg shadow-md hover:bg-[#ef7f1a] transition`}
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
