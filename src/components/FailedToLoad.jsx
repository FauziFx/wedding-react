import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import React from "react";

function FailedToLoad() {
  return (
    <div className="col-span-3 px-4 pt-2">
      <div className="shadow-lg rounded-md p-6 flex text-blue-gray-900">
        <ExclamationCircleIcon className="h-10 w-10" />
        <span className="pt-2 pl-2">Failed to load!</span>
      </div>
    </div>
  );
}

export default FailedToLoad;
