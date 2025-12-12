const Product = require("../models/Product");
const { uploadImage, deleteImage } = require("../config/cloudinary");

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = { isActive: true };

    // Category filter - UPDATED to handle multiple categories
    if (req.query.category) {
      // Check if category contains comma (multiple categories)
      if (req.query.category.includes(",")) {
        const categoryIds = req.query.category
          .split(",")
          .filter((id) => id.trim());
        query.category = { $in: categoryIds };
      } else {
        // Single category
        query.category = req.query.category;
      }
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Search filter
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Tags filter
    if (req.query.tags) {
      query.tags = { $in: req.query.tags.split(",") };
    }

    // Featured products
    if (req.query.featured === "true") {
      query.isFeatured = true;
    }

    // Sort options
    let sortOptions = {};
    if (req.query.sort) {
      switch (req.query.sort) {
        case "price_asc":
          sortOptions.price = 1;
          break;
        case "price_desc":
          sortOptions.price = -1;
          break;
        case "name_asc":
          sortOptions.name = 1;
          break;
        case "name_desc":
          sortOptions.name = -1;
          break;
        case "rating":
          sortOptions.rating = -1;
          break;
        case "newest":
          sortOptions.createdAt = -1;
          break;
        default:
          sortOptions.createdAt = -1;
      }
    } else {
      sortOptions.createdAt = -1;
    }

    // Execute query
    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort(sortOptions)
      .limit(limit)
      .skip(skip);

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by slug or ID
// @route   GET /api/products/:slugOrId
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;

    let product;

    // Check if it's a valid MongoDB ObjectId
    if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slugOrId).populate(
        "category",
        "name slug"
      );
    } else {
      product = await Product.findOne({
        slug: slugOrId,
        isActive: true,
      }).populate("category", "name slug");
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const productData = JSON.parse(JSON.stringify(req.body));

    // Parse JSON strings back to objects/arrays
    if (productData.features && typeof productData.features === "string") {
      productData.features = JSON.parse(productData.features);
    }
    if (productData.tags && typeof productData.tags === "string") {
      productData.tags = JSON.parse(productData.tags);
    }
    if (productData.weight && typeof productData.weight === "string") {
      productData.weight = JSON.parse(productData.weight);
    }

    // Handle image uploads if files are provided
    if (req.files && req.files.length > 0) {
      const imageUploads = await Promise.all(
        req.files.map(async (file) => {
          // Convert buffer to base64 properly
          const base64String = `data:${
            file.mimetype
          };base64,${file.buffer.toString("base64")}`;
          return await uploadImage(base64String, "cosmetic-shop/products");
        })
      );
      productData.images = imageUploads;
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updateData = JSON.parse(JSON.stringify(req.body));

    // Parse JSON strings back to objects/arrays
    if (updateData.features && typeof updateData.features === "string") {
      updateData.features = JSON.parse(updateData.features);
    }
    if (updateData.tags && typeof updateData.tags === "string") {
      updateData.tags = JSON.parse(updateData.tags);
    }
    if (updateData.weight && typeof updateData.weight === "string") {
      updateData.weight = JSON.parse(updateData.weight);
    }

    // Start with existing images
    let finalImages = [...(product.images || [])];

    // Handle images to delete
    if (updateData.imagesToDelete) {
      const imagesToDelete =
        typeof updateData.imagesToDelete === "string"
          ? JSON.parse(updateData.imagesToDelete)
          : updateData.imagesToDelete;

      if (Array.isArray(imagesToDelete) && imagesToDelete.length > 0) {
        // Delete from Cloudinary
        await Promise.all(
          imagesToDelete.map((imgUrl) => {
            const imageObj = product.images.find(
              (img) => (typeof img === "string" ? img : img.url) === imgUrl
            );
            if (imageObj && imageObj.publicId) {
              return deleteImage(imageObj.publicId);
            }
            return Promise.resolve();
          })
        );

        // Remove from final images array
        finalImages = finalImages.filter((img) => {
          const imgUrl = typeof img === "string" ? img : img.url;
          return !imagesToDelete.includes(imgUrl);
        });
      }

      // Remove imagesToDelete from updateData
      delete updateData.imagesToDelete;
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const imageUploads = await Promise.all(
        req.files.map(async (file) => {
          const base64String = `data:${
            file.mimetype
          };base64,${file.buffer.toString("base64")}`;
          return await uploadImage(base64String, "cosmetic-shop/products");
        })
      );

      // Add new images to the existing ones
      finalImages = [...finalImages, ...imageUploads];
    }

    // Update images in updateData
    updateData.images = finalImages;

    // Update product
    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("category", "name slug");
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map((img) =>
          img.publicId ? deleteImage(img.publicId) : Promise.resolve()
        )
      );
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
exports.getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true,
    })
      .limit(4)
      .select("name slug price images rating numReviews");

    res.status(200).json({
      success: true,
      count: relatedProducts.length,
      data: relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get best sellers
// @route   GET /api/products/best-sellers
// @access  Public
exports.getBestSellers = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const products = await Product.find({ isActive: true })
      .sort({ numReviews: -1, rating: -1 })
      .limit(limit)
      .populate("category", "name slug");

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};
