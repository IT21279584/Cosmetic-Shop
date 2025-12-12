import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import categoryService from "../../../services/categoryService";
import adminService from "../../../services/adminService";
import Input from "../../common/Input";
import Select from "../../common/Select";
import Checkbox from "../../common/Checkbox";
import Button from "../../common/Button";
import AdminSidebar from "../../admin/Sidebar";
import { toast } from "react-toastify";

// Fixed main categories (Level 0)
const MAIN_CATEGORIES = [
  "Women",
  "Men",
  "Mother & Baby",
  "Health & Wellbeing",
  "Fragrance",
];

const AddCategory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    mainCategory: "",
    parentCategory: "",
    order: 1,
    isActive: true,
  });

  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [duplicateWarning, setDuplicateWarning] = useState("");

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        const categories = data.data || data || [];
        setAllCategories(categories);
        console.log("Fetched categories:", categories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // Update available subcategories when main category changes
  useEffect(() => {
    if (formData.mainCategory) {
      const subcats = getSubcategoriesForMain(formData.mainCategory);
      setAvailableSubcategories(subcats);

      if (subcats.length === 0) {
        setFormData((prev) => ({
          ...prev,
          parentCategory: formData.mainCategory,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          parentCategory: "",
        }));
      }
    } else {
      setAvailableSubcategories([]);
      setFormData((prev) => ({
        ...prev,
        parentCategory: "",
      }));
    }
  }, [formData.mainCategory]);

  // Check for duplicates whenever name or parent changes
  useEffect(() => {
    checkForDuplicates();
  }, [formData.name, formData.parentCategory]);

  // Helper to get parent ID
  const getParentId = (category) => {
    if (!category.parentCategory) return null;
    return typeof category.parentCategory === "object"
      ? category.parentCategory._id
      : category.parentCategory;
  };

  // Get all subcategories under a main category
  const getSubcategoriesForMain = (mainCategoryId) => {
    const result = [];

    allCategories.forEach((cat) => {
      if (cat.level > 0 && cat.level < 3) {
        let current = cat;
        let depth = 0;

        while (current && depth < 10) {
          const parentId = getParentId(current);

          if (parentId === mainCategoryId) {
            result.push(cat);
            break;
          }

          if (parentId) {
            current = allCategories.find((c) => c._id === parentId);
          } else {
            break;
          }
          depth++;
        }
      }
    });

    result.sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level;
      return a.name.localeCompare(b.name);
    });

    return result;
  };

  // Build full path for a category
  const buildFullPath = (categoryId) => {
    const pathNames = [];
    let currentCat = allCategories.find((cat) => cat._id === categoryId);
    let depth = 0;

    while (currentCat && depth < 10) {
      pathNames.unshift(currentCat.name);

      const parentId = getParentId(currentCat);
      if (parentId) {
        currentCat = allCategories.find((c) => c._id === parentId);
      } else {
        currentCat = null;
      }
      depth++;
    }

    return pathNames.join(" → ");
  };

  // Check for duplicate category names under the same parent
  const checkForDuplicates = () => {
    if (!formData.name.trim() || !formData.parentCategory) {
      setDuplicateWarning("");
      return false;
    }

    const trimmedName = formData.name.trim().toLowerCase();

    // Find all sibling categories (categories with the same parent)
    const siblings = allCategories.filter((cat) => {
      const parentId = getParentId(cat);
      return parentId === formData.parentCategory;
    });

    // Check if any sibling has the same name (case-insensitive)
    const duplicate = siblings.find(
      (cat) => cat.name.toLowerCase() === trimmedName
    );

    if (duplicate) {
      const parentName = allCategories.find(
        (c) => c._id === formData.parentCategory
      )?.name;
      setDuplicateWarning(
        `A category named "${duplicate.name}" already exists under "${parentName}". Please choose a different name.`
      );
      return true;
    }

    setDuplicateWarning("");
    return false;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMainCategoryChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      mainCategory: value,
      parentCategory: "",
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (!formData.mainCategory) {
      toast.error("Please select a main category");
      return;
    }

    if (!formData.parentCategory) {
      toast.error("Please select a parent category");
      return;
    }

    // Check for duplicates before submitting
    if (checkForDuplicates()) {
      toast.error(
        "Cannot create duplicate category name under the same parent"
      );
      return;
    }

    // Check if exceeding max level
    const parentLevel = getParentLevel();
    if (parentLevel >= 3) {
      toast.error(
        "Maximum category level is 3. Cannot create deeper categories."
      );
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        name: formData.name.trim(),
        isActive: formData.isActive,
        order: parseInt(formData.order) || 1,
        parentCategory: formData.parentCategory,
      };

      await adminService.createCategory(submitData);
      toast.success("Category created successfully!");
      navigate("/admin/categories");
    } catch (err) {
      console.error("Error creating category:", err);

      // Handle backend duplicate error
      if (
        err.response?.status === 400 &&
        err.response?.data?.message?.includes("already exists")
      ) {
        toast.error(
          "This category name already exists under the selected parent"
        );
      } else {
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Failed to create category"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      mainCategory: "",
      parentCategory: "",
      order: 1,
      isActive: true,
    });
    setAvailableSubcategories([]);
    setDuplicateWarning("");
    toast.success("Form reset successfully");
  };

  // Get parent category level
  const getParentLevel = () => {
    if (!formData.parentCategory) return -1;
    const parent = allCategories.find(
      (cat) => cat._id === formData.parentCategory
    );
    return parent ? parent.level || 0 : 0;
  };

  // Get new category level
  const getNewCategoryLevel = () => {
    return getParentLevel() + 1;
  };

  // Get category hierarchy path
  const getCategoryPath = () => {
    if (!formData.parentCategory) return formData.name || "New Category";

    const path = [];
    let currentId = formData.parentCategory;
    let depth = 0;

    while (currentId && depth < 10) {
      const category = allCategories.find((cat) => cat._id === currentId);
      if (!category) break;
      path.unshift(category.name);

      const parentId = getParentId(category);
      currentId = parentId;
      depth++;
    }

    path.push(formData.name || "New Category");
    return path.join(" → ");
  };

  // Get main categories
  const mainCategories = allCategories.filter(
    (cat) => cat.level === 0 && MAIN_CATEGORIES.includes(cat.name)
  );

  const hasDuplicate = duplicateWarning !== "";

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
      <AdminSidebar />

      <div className="max-w-2xl mx-auto">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Add New Category
            </h1>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/categories")}
            >
              Back to List
            </Button>
          </div>

          {/* Info Box */}
          <div className="p-4 mb-6 border rounded-lg border-primary-200 bg-primary-50">
            <h3 className="mb-2 text-sm font-semibold text-primary-800">
              📌 Main Categories (Fixed):
            </h3>
            <div className="flex flex-wrap gap-2">
              {MAIN_CATEGORIES.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 text-sm font-medium rounded-full text-primary-800 bg-primary-100"
                >
                  {cat}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-primary-700">
              You can create subcategories under these main categories.
            </p>
          </div>

          <div className="space-y-5">
            {/* STEP 1: Select Main Category */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Step 1: Select Main Category{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                name="mainCategory"
                value={formData.mainCategory}
                onChange={handleMainCategoryChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              >
                <option value="">-- Select Main Category --</option>
                {mainCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* STEP 2: Select Parent Category */}
            {formData.mainCategory && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Step 2: Select Parent Category{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  name="parentCategory"
                  value={formData.parentCategory}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">-- Select Parent --</option>

                  <option value={formData.mainCategory}>
                    {
                      allCategories.find((c) => c._id === formData.mainCategory)
                        ?.name
                    }{" "}
                    (Main Category)
                  </option>

                  {availableSubcategories.length > 0 && (
                    <optgroup label="━━━ Subcategories ━━━">
                      {availableSubcategories.map((cat) => {
                        const fullPath = buildFullPath(cat._id);
                        const indent = "  ".repeat(cat.level);

                        return (
                          <option key={cat._id} value={cat._id}>
                            {indent}
                            {fullPath}
                          </option>
                        );
                      })}
                    </optgroup>
                  )}
                </select>

                <p className="mt-1 text-xs text-gray-500">
                  {availableSubcategories.length === 0
                    ? "No subcategories available. Your category will be created directly under the main category."
                    : `${availableSubcategories.length} subcategory options available`}
                </p>
              </div>
            )}

            {/* Category Name */}
            <div>
              <Input
                label="Category Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Makeup, Foundation, Lip Balm"
                required
              />

              {/* Duplicate Warning */}
              {hasDuplicate && (
                <div className="flex items-start p-3 mt-2 border border-red-200 rounded-lg bg-red-50">
                  <span className="mr-2 text-red-600">⚠️</span>
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      Duplicate Category Name
                    </p>
                    <p className="mt-1 text-xs text-red-700">
                      {duplicateWarning}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Is Active */}
            <Checkbox
              label="Active Category"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={
                  !formData.name.trim() ||
                  !formData.mainCategory ||
                  !formData.parentCategory ||
                  hasDuplicate ||
                  loading
                }
                loading={loading}
                fullWidth
              >
                {loading ? "Creating..." : "Create Category"}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                disabled={loading}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {formData.name && formData.parentCategory && !hasDuplicate && (
          <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Preview
            </h2>
            <div className="p-4 border border-gray-200 rounded-md">
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {formData.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong>Full Path:</strong> {getCategoryPath()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs rounded text-primary-700 bg-primary-100">
                    Level {getNewCategoryLevel()}
                  </span>

                  {getNewCategoryLevel() === 1 && (
                    <span className="px-2 py-1 text-xs text-purple-700 bg-purple-100 rounded">
                      Direct child of Main Category
                    </span>
                  )}

                  {getNewCategoryLevel() === 2 && (
                    <span className="px-2 py-1 text-xs text-indigo-700 bg-indigo-100 rounded">
                      Second level subcategory
                    </span>
                  )}

                  {getNewCategoryLevel() === 3 && (
                    <span className="px-2 py-1 text-xs rounded bg-violet-100 text-violet-700">
                      Third level (deepest allowed)
                    </span>
                  )}

                  <span className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded">
                    Order: {formData.order}
                  </span>

                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      formData.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {formData.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Show hierarchy breakdown */}
                <div className="pt-3 mt-3 border-t border-gray-200">
                  <p className="mb-2 text-xs font-medium text-gray-600">
                    Category Hierarchy:
                  </p>
                  {getCategoryPath()
                    .split(" → ")
                    .map((categoryName, index, arr) => (
                      <div
                        key={index}
                        className="flex items-center text-sm"
                        style={{ marginLeft: `${index * 20}px` }}
                      >
                        <span
                          className={`${
                            index === arr.length - 1
                              ? "font-bold text-primary-600"
                              : "text-gray-600"
                          }`}
                        >
                          {index === 0
                            ? "📁"
                            : index === arr.length - 1
                            ? "🆕"
                            : "📂"}{" "}
                          Level {index}: {categoryName}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCategory;
