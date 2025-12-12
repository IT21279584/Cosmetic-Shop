import React from "react";
import {
  FaSortAmountDown,
  FaClock,
  FaSortAmountUp,
  FaSortAlphaDown,
  FaSortAlphaUpAlt,
  FaStar,
} from "react-icons/fa";

const SortFilter = ({ selectedSort, onSortChange }) => {
  const sortOptions = [
    {
      value: "newest",
      label: "Newest First",
      icon: <FaClock className="w-4 h-4" />,
      description: "Latest arrivals",
    },
    {
      value: "price_asc",
      label: "Price: Low to High",
      icon: <FaSortAmountDown className="w-4 h-4" />,
      description: "Budget friendly",
    },
    {
      value: "price_desc",
      label: "Price: High to Low",
      icon: <FaSortAmountUp className="w-4 h-4" />,
      description: "Premium first",
    },
    {
      value: "name_asc",
      label: "Name: A to Z",
      icon: <FaSortAlphaDown className="w-4 h-4" />,
      description: "Alphabetically",
    },
    {
      value: "name_desc",
      label: "Name: Z to A",
      icon: <FaSortAlphaUpAlt className="w-4 h-4" />,
      description: "Reverse order",
    },
    {
      value: "rating",
      label: "Best Rated",
      icon: <FaStar className="w-4 h-4" />,
      description: "Top reviews",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-2">
        <div className="p-2 rounded-lg shadow-md bg-gradient-to-br from-primary-500 to-primary-600">
          <FaSortAmountDown className="w-5 h-5 text-white" />
        </div>
        <h4 className="text-lg font-semibold text-gray-900">Sort By</h4>
      </div>

      <div className="space-y-2">
        {sortOptions.map((option) => {
          const isSelected = selectedSort === option.value;

          return (
            <label
              key={option.value}
              className={`
                group relative flex items-start gap-3 p-4 rounded-xl cursor-pointer
                transition-all duration-300 border-2 overflow-hidden
                ${
                  isSelected
                    ? "bg-gradient-to-r from-primary-50 via-primary-100 to-primary-50 border-primary-500 shadow-lg"
                    : "bg-white border-gray-200 hover:border-primary-300 hover:shadow-md"
                }
              `}
            >
              {/* Animated background effect */}
              <div
                className={`
                absolute inset-0 bg-gradient-to-r from-primary-100/0 via-primary-100/50 to-primary-100/0
                transition-opacity duration-500
                ${isSelected ? "opacity-100 animate-pulse-slow" : "opacity-0"}
              `}
              />

              {/* Custom Radio Button */}
              <div className="relative mt-0.5 z-10">
                <div
                  className={`
                  relative w-5 h-5 rounded-full border-2 transition-all duration-300
                  ${
                    isSelected
                      ? "border-primary-600 bg-primary-600 scale-110"
                      : "border-gray-300 bg-white group-hover:border-primary-400 group-hover:scale-105"
                  }
                `}
                >
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-fade-in"></div>
                    </div>
                  )}
                </div>
                <input
                  type="radio"
                  name="sort"
                  value={option.value}
                  checked={isSelected}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="sr-only"
                />
              </div>

              {/* Content */}
              <div className="z-10 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`
                    transition-all duration-300
                    ${
                      isSelected
                        ? "text-primary-600 scale-110"
                        : "text-gray-400 group-hover:text-primary-500"
                    }
                  `}
                  >
                    {option.icon}
                  </div>
                  <span
                    className={`
                    font-medium transition-colors text-sm
                    ${
                      isSelected
                        ? "text-primary-700"
                        : "text-gray-900 group-hover:text-gray-900"
                    }
                  `}
                  >
                    {option.label}
                  </span>
                </div>
                <p
                  className={`
                  text-xs transition-colors
                  ${
                    isSelected
                      ? "text-primary-600"
                      : "text-gray-500 group-hover:text-gray-600"
                  }
                `}
                >
                  {option.description}
                </p>
              </div>

              {/* Checkmark Icon */}
              <div
                className={`
                transition-all duration-300 z-10 mt-1
                ${
                  isSelected
                    ? "opacity-100 scale-100 rotate-0"
                    : "opacity-0 scale-50 rotate-45"
                }
              `}
              >
                <svg
                  className="w-5 h-5 text-primary-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default SortFilter;
