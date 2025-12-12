const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// Fixed main categories
const MAIN_CATEGORIES = [
  { name: "Women", order: 1 },
  { name: "Men", order: 2 },
  { name: "Mother & Baby", order: 3 },
  { name: "Health & Wellbeing", order: 4 },
  { name: "Fragrance", order: 5 },
];

// Initialize main categories if they don't exist
async function ensureMainCategories() {
  try {
    for (const mainCat of MAIN_CATEGORIES) {
      const exists = await Category.findOne({ name: mainCat.name, level: 0 });
      if (!exists) {
        await Category.create({
          name: mainCat.name,
          order: mainCat.order,
          level: 0,
          parentCategory: null,
          isActive: true,
        });
        console.log(`✓ Created main category: ${mainCat.name}`);
      }
    }
  } catch (error) {
    console.error("Error ensuring main categories:", error);
  }
}

// Get all categories (flat list)
router.get("/", async (req, res, next) => {
  try {
    // Ensure main categories exist
    await ensureMainCategories();

    const categories = await Category.find({ isActive: true })
      .populate("parentCategory", "name")
      .sort({ level: 1, order: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
});

// Get category tree (hierarchical structure)
router.get("/tree", async (req, res, next) => {
  try {
    const activeOnly = req.query.activeOnly !== "false";
    const tree = await Category.getCategoryTree(null, activeOnly);

    res.status(200).json({
      success: true,
      data: tree,
    });
  } catch (error) {
    next(error);
  }
});

// Get main categories (level 0)
router.get("/main", async (req, res, next) => {
  try {
    // Ensure main categories exist
    await ensureMainCategories();

    const mainCategories = await Category.find({
      isActive: true,
      level: 0,
    }).sort({ order: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: mainCategories.length,
      data: mainCategories,
    });
  } catch (error) {
    next(error);
  }
});

// Get subcategories of a parent category
router.get("/:id/subcategories", async (req, res, next) => {
  try {
    const subcategories = await Category.find({
      parentCategory: req.params.id,
      isActive: true,
    }).sort({ order: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: subcategories.length,
      data: subcategories,
    });
  } catch (error) {
    next(error);
  }
});

// Get category breadcrumb/parent chain
router.get("/:id/breadcrumb", async (req, res, next) => {
  try {
    const breadcrumb = await Category.getParentChain(req.params.id);

    res.status(200).json({
      success: true,
      data: breadcrumb,
    });
  } catch (error) {
    next(error);
  }
});

// Get single category
router.get("/:id", async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "parentCategory",
      "name"
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Get subcategories
    const subcategories = await Category.find({
      parentCategory: category._id,
      isActive: true,
    }).sort({ order: 1, name: 1 });

    res.status(200).json({
      success: true,
      data: {
        ...category.toObject(),
        subcategories,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Create category (Admin)
router.post("/", protect, adminOnly, async (req, res, next) => {
  try {
    // Validate parent category exists if provided
    if (req.body.parentCategory) {
      const parentExists = await Category.findById(req.body.parentCategory);
      if (!parentExists) {
        return res.status(400).json({
          success: false,
          message: "Parent category not found",
        });
      }
    }

    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

// Update category (Admin)
router.put("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    // Prevent category from being its own parent
    if (req.body.parentCategory && req.body.parentCategory === req.params.id) {
      return res.status(400).json({
        success: false,
        message: "Category cannot be its own parent",
      });
    }

    // Validate parent category exists if provided
    if (req.body.parentCategory) {
      const parentExists = await Category.findById(req.body.parentCategory);
      if (!parentExists) {
        return res.status(400).json({
          success: false,
          message: "Parent category not found",
        });
      }
    }

    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

// Delete category (Admin)
router.delete("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if category has subcategories
    const hasSubcategories = await Category.findOne({
      parentCategory: req.params.id,
    });

    if (hasSubcategories) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete category with subcategories. Delete subcategories first.",
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

// Soft delete category (Admin) - set isActive to false
router.patch("/:id/deactivate", protect, adminOnly, async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deactivated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

// Reactivate category (Admin)
router.patch("/:id/activate", protect, adminOnly, async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category activated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
