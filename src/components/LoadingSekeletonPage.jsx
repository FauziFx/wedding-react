import React from "react";

function LoadingSekeletonPage() {
  return (
    <div className="px-4 pt-2 h-screen">
      <div className="shadow-lg rounded-md animate-pulse p-6 pt-8 h-full">
        <div className="w-2/3 h-4 bg-gray-700 mx-auto rounded mb-2"></div>
        <div className="w-2/3 h-4 bg-gray-700 mx-auto rounded mb-2"></div>
        <div className="h-48 w-48 bg-gray-700 mx-auto rounded-full my-8"></div>
        <div className="w-1/3 h-4 bg-gray-700 mx-auto rounded my-6"></div>
        <div className="w-2/3 h-8 bg-gray-700 mx-auto rounded my-6"></div>
        <div className="w-3/4 h-8 bg-gray-700 mx-auto rounded my-6"></div>
        <div className="w-1/2 h-8 bg-gray-700 mx-auto rounded my-6"></div>
        <div className="w-1/3 h-4 bg-gray-700 mx-auto rounded my-6"></div>
        <div className="w-1/3 h-4 bg-gray-700 mx-auto rounded my-6"></div>
        <div className="w-2/3 h-4 bg-gray-700 mx-auto rounded my-6"></div>
        <div className="w-1/3 h-4 bg-gray-700 mx-auto rounded my-6"></div>
      </div>
    </div>
  );
}

export default LoadingSekeletonPage;
