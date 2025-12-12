import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../../../services/adminService";
import Input from "../../common/Input";
import Button from "../../common/Button";
import Select from "../../common/Select";
import TextArea from "../../common/TextArea ";
import Checkbox from "../../common/Checkbox";
import AdminSidebar from "../../admin/Sidebar";
import { toast } from "react-toastify";

const MAIN_CATEGORIES = [
  "Women",
  "Men",
  "Mother & Baby",
  "Health & Wellbeing",
  "Fragrance",
];

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    price: "",
    comparePrice: "",
    stock: "",
    sku: "",
    category: "",
    features: [""],
    ingredients: "",
    howToUse: "",
    weight: {
      value: "",
      unit: "ml",
    },
    tags: "",
    isFeatured: false,
    isActive: true,
  });

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const response = await adminService.getCategories();
      setAllCategories(response.data || response);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const getParentId = (category) => {
    if (!category.parentCategory) return null;
    return typeof category.parentCategory === "object"
      ? category.parentCategory._id
      : category.parentCategory;
  };

  const buildFullPath = (category) => {
    const pathNames = [];
    let current = category;
    let depth = 0;

    while (current && depth < 10) {
      pathNames.unshift(current.name);
      const parentId = getParentId(current);
      if (parentId) {
        current = allCategories.find((c) => c._id === parentId);
      } else {
        current = null;
      }
      depth++;
    }

    return pathNames.join(" → ");
  };

  const getGroupedCategories = () => {
    const mainCats = allCategories.filter(
      (cat) => cat.level === 0 && MAIN_CATEGORIES.includes(cat.name)
    );

    return mainCats.map((mainCat) => {
      const subcats = allCategories.filter((cat) => {
        if (cat.level === 0) return false;
        let current = cat;
        let depth = 0;

        while (current && depth < 10) {
          const parentId = getParentId(current);
          if (!parentId) return false;
          if (parentId === mainCat._id) return true;
          current = allCategories.find((c) => c._id === parentId);
          depth++;
        }

        return false;
      });

      subcats.sort((a, b) => {
        if (a.level !== b.level) return a.level - b.level;
        return a.name.localeCompare(b.name);
      });

      return {
        main: mainCat,
        subcategories: subcats,
      };
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("weight.")) {
      const weightField = name.split(".")[1];
      setFormData({
        ...formData,
        weight: { ...formData.weight, [weightField]: value },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const newImageFiles = [...imageFiles];
    newImageFiles[index] = file;
    setImageFiles(newImageFiles);

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPreviews = [...imagePreviews];
      newPreviews[index] = reader.result;
      setImagePreviews(newPreviews);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index) => {
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(newImageFiles);
    setImagePreviews(newPreviews);
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageFiles.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    setLoading(true);

    try {
      const submitFormData = new FormData();

      imageFiles.forEach((file) => {
        submitFormData.append("images", file);
      });

      submitFormData.append("name", formData.name);
      submitFormData.append("description", formData.description);
      submitFormData.append("price", parseFloat(formData.price));
      submitFormData.append("stock", parseInt(formData.stock));
      submitFormData.append("sku", formData.sku);
      submitFormData.append("category", formData.category);
      submitFormData.append("isActive", formData.isActive);
      submitFormData.append("isFeatured", formData.isFeatured);

      if (formData.shortDescription) {
        submitFormData.append("shortDescription", formData.shortDescription);
      }
      if (formData.comparePrice) {
        submitFormData.append(
          "comparePrice",
          parseFloat(formData.comparePrice)
        );
      }
      if (formData.ingredients) {
        submitFormData.append("ingredients", formData.ingredients);
      }
      if (formData.howToUse) {
        submitFormData.append("howToUse", formData.howToUse);
      }

      const features = formData.features.filter((f) => f.trim() !== "");
      if (features.length > 0) {
        submitFormData.append("features", JSON.stringify(features));
      }

      if (formData.tags) {
        const tags = formData.tags.split(",").map((tag) => tag.trim());
        submitFormData.append("tags", JSON.stringify(tags));
      }

      if (formData.weight.value) {
        submitFormData.append(
          "weight",
          JSON.stringify({
            value: parseFloat(formData.weight.value),
            unit: formData.weight.unit,
          })
        );
      }

      await adminService.createProduct(submitFormData);
      toast.success("Product created successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const groupedCategories = getGroupedCategories();

  return (
    <div className="min-h-screen px-4 py-4 bg-gradient-to-br sm:px-6 lg:px-8">
      <AdminSidebar />

      <div className="max-w-5xl mx-auto">
        {/* Header with gradient */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 shadow-lg sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
              <svg
                className="w-5 h-5 text-white sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-transparent sm:text-3xl lg:text-4xl bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text">
              Add New Product
            </h2>
          </div>
          <p className="ml-0 text-sm text-gray-600 sm:text-base sm:ml-14">
            Create a stunning new product for your cosmetic collection
          </p>
        </div>

        <div className="overflow-hidden border shadow-xl border-primary-100 bg-white/80 backdrop-blur-sm rounded-2xl">
          {/* Product Images Section */}
          <div className="p-4 border-b border-primary-100 sm:p-6 lg:p-8 bg-gradient-to-r ">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-500">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 sm:text-xl">
                Product Images <span className="ml-1 text-primary-500">*</span>
              </h3>
            </div>
            <p className="mb-4 text-xs text-gray-600 sm:text-sm sm:mb-6">
              Upload up to 4 stunning images. First image will be your hero
              shot.
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="relative group">
                  <div className="p-3 transition-all duration-300 border-2 border-dashed border-primary-200 rounded-xl sm:p-4 hover:border-primary-400 hover:bg-primary-50/50">
                    {imagePreviews[index] ? (
                      <div className="relative">
                        <img
                          src={imagePreviews[index]}
                          alt={`Preview ${index + 1}`}
                          className="object-cover w-full h-24 rounded-lg shadow-md sm:h-32"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute flex items-center justify-center text-white transition-transform rounded-full shadow-lg -top-2 -right-2 bg-gradient-to-br from-primary-500 to-primary-600 w-7 h-7 hover:scale-110"
                        >
                          ×
                        </button>
                        {index === 0 && (
                          <span className="absolute px-2 py-1 text-xs font-medium text-white rounded-md shadow-md bottom-1 left-1 bg-gradient-to-r from-primary-500 to-primary-600">
                            Hero
                          </span>
                        )}
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-24 transition-transform cursor-pointer sm:h-32 group-hover:scale-105">
                        <div className="flex items-center justify-center w-10 h-10 mb-2 transition-colors rounded-full sm:w-12 sm:h-12 bg-gradient-to-br from-primary-100 to-orange-100 group-hover:from-primary-200 group-hover:to-orange-200">
                          <svg
                            className="w-5 h-5 text-primary-500 sm:w-6 sm:h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </div>
                        <span className="text-xs font-medium text-center text-gray-600">
                          {index === 0 ? "Main Image" : `Image ${index + 1}`}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, index)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Sections */}
          <div className="p-4 space-y-6 sm:p-6 lg:p-8 sm:space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-500">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 sm:text-xl">
                  Basic Information
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Input
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="SKU"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                />
              </div>

              <TextArea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />

              <TextArea
                label="Short Description"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows={2}
                maxLength={200}
                placeholder="Max 200 characters"
              />
            </div>

            {/* Category */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-500">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 sm:text-xl">
                  Category
                </h3>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Select Category <span className="text-primary-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 transition-all bg-white border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-primary-300"
                  required
                >
                  <option value="">-- Select a category --</option>
                  {groupedCategories.map(({ main, subcategories }) => (
                    <React.Fragment key={main._id}>
                      <option value={main._id} className="font-semibold">
                        {main.name}
                      </option>
                      {subcategories.map((subcat) => {
                        const fullPath = buildFullPath(subcat);
                        const indent = "  ".repeat(subcat.level);
                        return (
                          <option key={subcat._id} value={subcat._id}>
                            {indent}
                            {fullPath}
                          </option>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </select>
                <p className="mt-2 text-xs text-gray-500">
                  Select from main categories or their subcategories
                </p>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-500">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 sm:text-xl">
                  Pricing & Stock
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
                <Input
                  label="Compare Price (Optional)"
                  type="number"
                  name="comparePrice"
                  value={formData.comparePrice}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                />
              </div>

              <Input
                label="Stock Quantity"
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-500">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 sm:text-xl">
                  Product Details
                </h3>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Key Features
                </label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) =>
                        handleFeatureChange(index, e.target.value)
                      }
                      className="flex-1 px-4 py-3 transition-all border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-primary-300"
                      placeholder={`Feature ${index + 1}`}
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="px-4 py-2 font-medium transition-colors text-primary-600 hover:bg-primary-50 rounded-xl"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 group"
                >
                  <span className="flex items-center justify-center w-6 h-6 transition-colors rounded-full bg-primary-100 group-hover:bg-primary-200">
                    +
                  </span>
                  Add Feature
                </button>
              </div>

              <TextArea
                label="Ingredients"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                rows={3}
              />

              <TextArea
                label="How to Use"
                name="howToUse"
                value={formData.howToUse}
                onChange={handleChange}
                rows={3}
              />

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Weight/Volume
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    name="weight.value"
                    value={formData.weight.value}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    placeholder="Value"
                  />
                  <Select
                    name="weight.unit"
                    value={formData.weight.unit}
                    onChange={handleChange}
                  >
                    <option value="ml">ml</option>
                    <option value="l">L</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="oz">oz</option>
                  </Select>
                </div>
              </div>

              <Input
                label="Tags (comma-separated)"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="organic, natural, vegan, cruelty-free"
              />
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 sm:text-xl">
                  Settings
                </h3>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                <Checkbox
                  label="Featured Product"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                />
                <Checkbox
                  label="Active"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-primary-100">
              <Button
                type="button"
                loading={loading}
                onClick={handleSubmit}
                className="w-full sm:w-auto"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Create Product
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
