import React from "react";
import { PRICE_RANGES } from "../../utils/constants";

const PriceFilter = ({ selectedRange, onRangeChange }) => {
  return (
    <div className="space-y-4">
      <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
        <span className="w-1 h-6 rounded-full bg-gradient-to-b from-primary-500 to-primary-600"></span>
        Price Range
      </h4>

      <div className="space-y-2">
        {/* All Prices Option */}
        <label
          className={`
            group relative flex items-center justify-between p-4 rounded-xl cursor-pointer
            transition-all duration-300 border-2
            ${
              selectedRange.min === "" && selectedRange.max === ""
                ? "bg-gradient-to-r from-primary-50 to-primary-100 border-primary-500 shadow-md"
                : "bg-white border-gray-200 hover:border-primary-300 hover:bg-primary-50/50"
            }
          `}
        >
          <div className="flex items-center gap-3">
            <div
              className={`
              relative w-5 h-5 rounded-full border-2 transition-all duration-300
              ${
                selectedRange.min === "" && selectedRange.max === ""
                  ? "border-primary-600 bg-primary-600"
                  : "border-gray-300 group-hover:border-primary-400"
              }
            `}
            >
              {selectedRange.min === "" && selectedRange.max === "" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            <span
              className={`
              font-medium transition-colors
              ${
                selectedRange.min === "" && selectedRange.max === ""
                  ? "text-primary-700"
                  : "text-gray-700 group-hover:text-gray-900"
              }
            `}
            >
              All Prices
            </span>
          </div>
          <input
            type="radio"
            name="priceRange"
            checked={selectedRange.min === "" && selectedRange.max === ""}
            onChange={() => onRangeChange({ min: "", max: "" })}
            className="sr-only"
          />
        </label>

        {/* Price Range Options */}
        {PRICE_RANGES.map((range, index) => {
          const isChecked =
            String(selectedRange.min) === String(range.min) &&
            (range.max
              ? String(selectedRange.max) === String(range.max)
              : selectedRange.max === "");

          return (
            <label
              key={index}
              className={`
                group relative flex items-center justify-between p-4 rounded-xl cursor-pointer
                transition-all duration-300 border-2
                ${
                  isChecked
                    ? "bg-gradient-to-r from-primary-50 to-primary-100 border-primary-500 shadow-md"
                    : "bg-white border-gray-200 hover:border-primary-300 hover:bg-primary-50/50"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                  relative w-5 h-5 rounded-full border-2 transition-all duration-300
                  ${
                    isChecked
                      ? "border-primary-600 bg-primary-600"
                      : "border-gray-300 group-hover:border-primary-400"
                  }
                `}
                >
                  {isChecked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
                <span
                  className={`
                  font-medium transition-colors
                  ${
                    isChecked
                      ? "text-primary-700"
                      : "text-gray-700 group-hover:text-gray-900"
                  }
                `}
                >
                  {range.label}
                </span>
              </div>

              {/* Decorative arrow on hover */}
              <div
                className={`
                transition-all duration-300
                ${
                  isChecked
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-2 group-hover:opacity-50 group-hover:translate-x-0"
                }
              `}
              >
                <svg
                  className="w-5 h-5 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>

              <input
                type="radio"
                name="priceRange"
                checked={isChecked}
                onChange={() =>
                  onRangeChange({
                    min: String(range.min),
                    max: range.max ? String(range.max) : "",
                  })
                }
                className="sr-only"
              />
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default PriceFilter;
