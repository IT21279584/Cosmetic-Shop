const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    level: {
      type: Number,
      default: 0, // 0 = Main category (Women), 1 = Section (Makeup, Skin), 2 = Subcategory (Foundation, Lip Balm)
      min: 0,
      max: 3,
    },
    order: {
      type: Number,
      default: 0, // For custom sorting within same level
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for getting subcategories
categorySchema.virtual("subcategories", {
  ref: "Category",
  localField: "_id",
  foreignField: "parentCategory",
});

// Index for efficient querying
categorySchema.index({ parentCategory: 1, order: 1 });

// Automatically set level based on parent
categorySchema.pre("save", async function (next) {
  try {
    if (this.isModified("parentCategory")) {
      if (this.parentCategory) {
        const parent = await mongoose.models.Category.findById(
          this.parentCategory
        );
        if (parent) {
          this.level = parent.level + 1;

          // Prevent nesting beyond max level
          if (this.level > 3) {
            throw new Error("Maximum category nesting level (3) exceeded");
          }
        }
      } else {
        this.level = 0;
      }
    }

  } catch (error) {
    next(error);
  }
});

// Handle insertMany operations
categorySchema.pre("insertMany", async function (next, docs) {
  if (docs && docs.length) {
    for (const doc of docs) {
      // Set level for batch inserts
      if (doc.parentCategory) {
        const parent = await mongoose.models.Category.findById(
          doc.parentCategory
        );
        if (parent) {
          doc.level = parent.level + 1;
        }
      } else {
        doc.level = 0;
      }
    }
  }
});

// Static method to get category tree
categorySchema.statics.getCategoryTree = async function (
  parentId = null,
  activeOnly = true
) {
  const query = { parentCategory: parentId };
  if (activeOnly) {
    query.isActive = true;
  }

  const categories = await this.find(query).sort({ order: 1, name: 1 }).lean();

  // Recursively get subcategories
  for (let category of categories) {
    category.children = await this.getCategoryTree(category._id, activeOnly);
  }

  return categories;
};

// Static method to get all parent categories (breadcrumb)
categorySchema.statics.getParentChain = async function (categoryId) {
  const chain = [];
  let currentId = categoryId;

  while (currentId) {
    const category = await this.findById(currentId).lean();
    if (!category) break;

    chain.unshift(category);
    currentId = category.parentCategory;
  }

  return chain;
};

// Instance method to get all descendants
categorySchema.methods.getAllDescendants = async function () {
  const descendants = [];
  const children = await mongoose.models.Category.find({
    parentCategory: this._id,
  });

  for (const child of children) {
    descendants.push(child);
    const childDescendants = await child.getAllDescendants();
    descendants.push(...childDescendants);
  }

  return descendants;
};

module.exports = mongoose.model("Category", categorySchema);
