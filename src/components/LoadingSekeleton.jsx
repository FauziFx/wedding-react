import React from "react";

function LoadingSekeleton() {
  return (
    <div className="col-span-3 px-4 pt-2">
      <div className="shadow-lg rounded-md animate-pulse p-6">
        <div className="w-2/3 h-4 bg-gray-700 rounded mb-2"></div>
        <div className="w-full h-8 bg-gray-700 rounded mb-2"></div>
        <div className="w-full h-8 bg-gray-700 rounded mb-2"></div>
        <div className="w-1/2 h-8 bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}

export default LoadingSekeleton;
