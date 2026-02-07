import React from "react";
import MainLayOut from "@/layout/MainLayOut";
import { useRouter } from "next/router";

const NotFound = () => {
  const router = useRouter();

  return (
    <MainLayOut>
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        {/* Illustration */}
        <div className="max-w-sm mb-8">
          <img
            src="/images/Monster 404 Error-pana.svg"
            alt="404 Page Not Found"
            className="w-full animate-bounce-slow"
          />
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
          404
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-600 mb-8">
          Oops! The page you’re looking for doesn’t exist.
        </p>

        {/* Home Button */}
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
        >
          Go Back Home
        </button>

        {/* Optional: small decorative text */}
        <p className="mt-6 text-gray-400 text-sm">
          Or check the URL for typos and try again.
        </p>
      </div>

      {/* Optional: gradient background or shapes */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 w-full h-full"></div>
      </div>
    </MainLayOut>
  );
};

export default NotFound;
