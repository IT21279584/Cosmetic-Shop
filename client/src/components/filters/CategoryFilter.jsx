import React from "react";

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div>
      <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
      <div className="space-y-2">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="category"
            checked={!selectedCategory}
            onChange={() => onCategoryChange("")}
            className="mr-2 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-gray-700">All Products</span>
        </label>

        {categories.map((category) => (
          <label
            key={category._id}
            className="flex items-center cursor-pointer"
          >
            <input
              type="radio"
              name="category"
              checked={selectedCategory === category._id}
              onChange={() => onCategoryChange(category._id)}
              className="mr-2 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-gray-700">{category.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
