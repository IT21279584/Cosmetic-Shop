import React from "react";
import {

  FaSpinner,

} from "react-icons/fa";

const Loader = ({ size = "md", fullScreen = false }) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const loader = (
    <div
      className={`spinner ${sizes[size]} border-4 border-primary-600 border-t-transparent rounded-full animate-spin`}
    />
  );

  if (fullScreen) {
    return (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <FaSpinner className="w-12 h-12 mx-auto mb-4 text-primary-600 animate-spin" />
              <p className="text-gray-600">Loading ...</p>
            </div>
          </div>
        );
  }

  return <div className="flex items-center justify-center py-12">{loader}</div>;
};

export default Loader;
