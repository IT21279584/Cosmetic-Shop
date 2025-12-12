require("dotenv").config();
const mongoose = require("mongoose");
const slugify = require("slugify");
const connectDB = require("../config/database");
const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Inventory = require("../models/Inventory");

// Sample Data
const users = [
  {
    name: "Admin User",
    email: "admin@cosmeticshop.com",
    password: "Admin@123",
    role: "admin",
    phone: "+1234567890",
    isActive: true,
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "User@123",
    role: "user",
    phone: "+1234567891",
    addresses: [
      {
        fullName: "John Doe",
        phone: "+1234567891",
        addressLine1: "123 Main Street",
        addressLine2: "Apt 4B",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
        isDefault: true,
      },
    ],
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "User@123",
    role: "user",
    phone: "+1234567892",
  },
];

const categories = [
  {
    name: "Skincare",
    description: "Premium skincare products for all skin types",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571",
  },
  {
    name: "Makeup",
    description: "Professional makeup and cosmetics",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796",
  },
  {
    name: "Haircare",
    description: "Luxury hair care and styling products",
    image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da",
  },
  {
    name: "Fragrance",
    description: "Exquisite perfumes and fragrances",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601",
  },
  {
    name: "Body Care",
    description: "Nourishing body lotions and treatments",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b",
  },
];

const getProducts = (categoryIds) => [
  // Skincare Products
  {
    name: "Hydrating Vitamin C Serum",
    slug: slugify("hydrating-vitamin-c-serum", { lower: true }),

    description:
      "Brighten and hydrate your skin with our premium Vitamin C serum. This powerful antioxidant formula helps reduce dark spots, fine lines, and protects against environmental damage.",
    shortDescription: "Brightening serum with 20% pure Vitamin C",
    category: categoryIds[0],
    price: 79.99,
    comparePrice: 99.99,
    images: [
      {
        url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be",
        publicId: "serum1",
      },
      {
        url: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b",
        publicId: "serum2",
      },
      {
        url: "https://images.unsplash.com/photo-1556228578-dd6a8b0e3992",
        publicId: "serum3",
      },
      {
        url: "https://images.unsplash.com/photo-1556228720-195a672e8a03",
        publicId: "serum4",
      },
    ],
    stock: 150,
    sku: "SKIN-VCS-001",
    rating: 4.8,
    numReviews: 234,
    features: [
      "20% Pure Vitamin C",
      "Brightens skin tone",
      "Reduces dark spots",
      "Anti-aging properties",
      "Suitable for all skin types",
    ],
    ingredients:
      "Aqua, Ascorbic Acid (Vitamin C), Hyaluronic Acid, Vitamin E, Ferulic Acid",
    howToUse:
      "Apply 3-4 drops to clean, dry skin morning and evening. Follow with moisturizer.",
    weight: { value: 30, unit: "ml" },
    isActive: true,
    isFeatured: true,
    tags: ["vitamin-c", "serum", "brightening", "anti-aging"],
  },
  {
    name: "Luxury Rose Gold Face Cream",
    slug: slugify("luxury-rose-gold-face-cream", { lower: true }),

    description:
      "Indulge in our luxurious rose gold-infused moisturizer. Enriched with 24K gold flakes and rose extract, this cream provides intense hydration while giving your skin a luminous glow.",
    shortDescription: "Anti-aging cream with 24K gold and rose extract",
    category: categoryIds[0],
    price: 129.99,
    comparePrice: 159.99,
    images: [
      {
        url: "https://images.unsplash.com/photo-1571875257727-256c39da42af",
        publicId: "cream1",
      },
      {
        url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be",
        publicId: "cream2",
      },
      {
        url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
        publicId: "cream3",
      },
      {
        url: "https://images.unsplash.com/photo-1556228852-80c3be746b2e",
        publicId: "cream4",
      },
    ],
    stock: 85,
    sku: "SKIN-RGC-002",
    rating: 4.9,
    numReviews: 189,
    features: [
      "24K Gold flakes",
      "Rosa Damascena extract",
      "Deep hydration",
      "Anti-aging formula",
      "Luxurious texture",
    ],
    ingredients:
      "Gold Flakes, Rosa Damascena Extract, Shea Butter, Hyaluronic Acid, Peptides",
    howToUse:
      "Apply to cleansed face and neck morning and evening. Massage gently until absorbed.",
    weight: { value: 50, unit: "ml" },
    isActive: true,
    isFeatured: true,
    tags: ["moisturizer", "luxury", "anti-aging", "gold"],
  },
  {
    name: "Gentle Exfoliating Enzyme Mask",
    slug: slugify("gentle-exfoliating-enzyme-mask", { lower: true }),

    description:
      "Experience gentle yet effective exfoliation with our enzyme mask. Formulated with natural papaya and pineapple enzymes, it removes dead skin cells, revealing brighter, smoother skin.",
    shortDescription: "Natural enzyme mask for gentle exfoliation",
    category: categoryIds[0],
    price: 45.99,
    images: [
      {
        url: "https://images.unsplash.com/photo-1556228720-195a672e8a03",
        publicId: "mask1",
      },
      {
        url: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8",
        publicId: "mask2",
      },
      {
        url: "https://images.unsplash.com/photo-1556228841-2c7c6171ce0e",
        publicId: "mask3",
      },
      {
        url: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b",
        publicId: "mask4",
      },
    ],
    stock: 200,
    sku: "SKIN-EEM-003",
    rating: 4.7,
    numReviews: 156,
    features: [
      "Natural enzymes",
      "Gentle exfoliation",
      "Brightens complexion",
      "No harsh scrubs",
      "Weekly treatment",
    ],
    ingredients:
      "Papaya Extract, Pineapple Extract, Aloe Vera, Chamomile, Green Tea",
    howToUse:
      "Apply thin layer to clean face. Leave for 10-15 minutes. Rinse with lukewarm water. Use 2-3 times weekly.",
    weight: { value: 75, unit: "ml" },
    isActive: true,
    isFeatured: false,
    tags: ["mask", "exfoliating", "natural", "brightening"],
  },

  // Makeup Products
  {
    name: "Velvet Matte Liquid Lipstick",
    slug: slugify("velvet-matte-liquid-lipstick", { lower: true }),

    description:
      "Get the perfect pout with our long-lasting velvet matte liquid lipstick. The ultra-pigmented formula glides on smoothly and dries to a comfortable, transfer-proof matte finish.",
    shortDescription: "Long-lasting matte liquid lipstick",
    category: categoryIds[1],
    price: 24.99,
    images: [
      {
        url: "https://images.unsplash.com/photo-1586495777744-4413f21062fa",
        publicId: "lip1",
      },
      {
        url: "https://images.unsplash.com/photo-1631214524020-7e18db3a8c32",
        publicId: "lip2",
      },
      {
        url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
        publicId: "lip3",
      },
      {
        url: "https://images.unsplash.com/photo-1583241477403-09b5a6a2e39a",
        publicId: "lip4",
      },
    ],
    stock: 300,
    sku: "MAKE-VML-004",
    rating: 4.6,
    numReviews: 412,
    features: [
      "Ultra-pigmented",
      "Long-lasting (8+ hours)",
      "Transfer-proof",
      "Comfortable wear",
      "Available in 12 shades",
    ],
    ingredients:
      "Isododecane, Dimethicone, Kaolin, Vitamin E, Natural Pigments",
    howToUse:
      "Apply directly to lips. Allow to dry for best results. Layer for more intensity.",
    weight: { value: 7, unit: "ml" },
    isActive: true,
    isFeatured: true,
    tags: ["lipstick", "matte", "makeup", "long-lasting"],
  },
  {
    name: "HD Foundation - Natural Finish",
    slug: slugify("hd-foundation-natural-finish", { lower: true }),

    description:
      "Achieve flawless skin with our HD foundation. This buildable, medium-to-full coverage formula provides a natural finish that looks perfect both in person and on camera.",
    shortDescription: "HD foundation with natural finish",
    category: categoryIds[1],
    price: 49.99,
    comparePrice: 59.99,
    images: [
      {
        url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
        publicId: "found1",
      },
      {
        url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
        publicId: "found2",
      },
      {
        url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796",
        publicId: "found3",
      },
      {
        url: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2",
        publicId: "found4",
      },
    ],
    stock: 180,
    sku: "MAKE-HDF-005",
    rating: 4.8,
    numReviews: 325,
    features: [
      "Medium to full coverage",
      "Natural finish",
      "Buildable formula",
      "Long-wearing (12 hours)",
      "40 shade range",
    ],
    ingredients:
      "Water, Cyclopentasiloxane, Titanium Dioxide, Dimethicone, SPF 15",
    howToUse:
      "Apply with brush, sponge, or fingers. Build coverage as desired. Set with powder.",
    weight: { value: 30, unit: "ml" },
    isActive: true,
    isFeatured: true,
    tags: ["foundation", "makeup", "hd", "full-coverage"],
  },

  // Haircare Products
  {
    name: "Repairing Argan Oil Hair Mask",
    slug: slugify("repairing-argan-oil-hair-mask", { lower: true }),

    description:
      "Transform damaged hair with our intensive argan oil hair mask. Rich in nutrients and antioxidants, it deeply nourishes, repairs, and restores shine to all hair types.",
    shortDescription: "Deep conditioning mask with pure argan oil",
    category: categoryIds[2],
    price: 38.99,
    images: [
      {
        url: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da",
        publicId: "hair1",
      },
      {
        url: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d",
        publicId: "hair2",
      },
      {
        url: "https://images.unsplash.com/photo-1519735777090-ec97162dc266",
        publicId: "hair3",
      },
      {
        url: "https://images.unsplash.com/photo-1571875257727-256c39da42af",
        publicId: "hair4",
      },
    ],
    stock: 220,
    sku: "HAIR-AOM-006",
    rating: 4.9,
    numReviews: 278,
    features: [
      "Pure Moroccan argan oil",
      "Deep conditioning",
      "Repairs damage",
      "Adds shine",
      "Suitable for all hair types",
    ],
    ingredients: "Argan Oil, Shea Butter, Keratin, Vitamin E, Coconut Oil",
    howToUse:
      "Apply to damp hair, focusing on ends. Leave for 10-20 minutes. Rinse thoroughly.",
    weight: { value: 200, unit: "ml" },
    isActive: true,
    isFeatured: false,
    tags: ["haircare", "mask", "argan-oil", "repair"],
  },

  // Fragrance Products
  {
    name: "Elegant Rose Eau de Parfum",
    slug: slugify("elegant-rose-eau-de-parfum", { lower: true }),

    description:
      "Experience the timeless elegance of our signature rose perfume. A sophisticated blend of Bulgarian rose, jasmine, and warm musk creates a captivating, long-lasting fragrance.",
    shortDescription: "Luxurious rose-based eau de parfum",
    category: categoryIds[3],
    price: 89.99,
    comparePrice: 119.99,
    images: [
      {
        url: "https://images.unsplash.com/photo-1541643600914-78b084683601",
        publicId: "perf1",
      },
      {
        url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539",
        publicId: "perf2",
      },
      {
        url: "https://images.unsplash.com/photo-1563170351-be82bc888aa4",
        publicId: "perf3",
      },
      {
        url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f",
        publicId: "perf4",
      },
    ],
    stock: 95,
    sku: "FRAG-ERE-007",
    rating: 4.7,
    numReviews: 167,
    features: [
      "Bulgarian rose essence",
      "Long-lasting (8-10 hours)",
      "Sophisticated blend",
      "Luxury packaging",
      "Perfect for any occasion",
    ],
    ingredients:
      "Alcohol Denat., Fragrance, Rosa Damascena, Jasmine Absolute, Musk",
    howToUse: "Spray on pulse points: wrists, neck, behind ears. Do not rub.",
    weight: { value: 50, unit: "ml" },
    isActive: true,
    isFeatured: true,
    tags: ["perfume", "fragrance", "rose", "luxury"],
  },

  // Body Care Products
  {
    name: "Nourishing Body Butter - Vanilla",
    slug: slugify("nourishing-body-butter-vanilla", { lower: true }),

    description:
      "Indulge your skin with our rich, nourishing body butter. Infused with shea butter and vanilla, it provides intense hydration and leaves skin soft, smooth, and delicately scented.",
    shortDescription: "Ultra-rich body butter with vanilla",
    category: categoryIds[4],
    price: 34.99,
    images: [
      {
        url: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b",
        publicId: "body1",
      },
      {
        url: "https://images.unsplash.com/photo-1556228720-195a672e8a03",
        publicId: "body2",
      },
      {
        url: "https://images.unsplash.com/photo-1571875257727-256c39da42af",
        publicId: "body3",
      },
      {
        url: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571",
        publicId: "body4",
      },
    ],
    stock: 175,
    sku: "BODY-NBV-008",
    rating: 4.8,
    numReviews: 298,
    features: [
      "Ultra-rich formula",
      "Shea butter base",
      "Natural vanilla scent",
      "Long-lasting hydration",
      "Non-greasy finish",
    ],
    ingredients:
      "Shea Butter, Cocoa Butter, Vitamin E, Vanilla Extract, Coconut Oil",
    howToUse:
      "Apply generously to clean, dry skin. Massage until absorbed. Use daily.",
    weight: { value: 200, unit: "g" },
    isActive: true,
    isFeatured: false,
    tags: ["body-butter", "moisturizer", "vanilla", "hydrating"],
  },
];

// Seeder functions
const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Inventory.deleteMany();

    console.log("🗑️  Data cleared");

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log("✅ Users seeded");

    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    const categoryIds = createdCategories.map((cat) => cat._id);
    console.log("✅ Categories seeded");

    // Insert products
    const productsWithCategories = getProducts(categoryIds);
    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log("✅ Products seeded");

    // Create inventory for each product
    const inventoryData = createdProducts.map((product) => ({
      product: product._id,
      quantity: product.stock,
      lowStockThreshold: 10,
      reorderQuantity: 50,
      lastRestocked: new Date(),
      stockHistory: [
        {
          quantity: product.stock,
          type: "in",
          reason: "Initial stock",
          date: new Date(),
        },
      ],
    }));

    await Inventory.insertMany(inventoryData);
    console.log("✅ Inventory seeded");

    console.log(`
    ╔════════════════════════════════════════╗
    ║                                        ║
    ║   ✨ Database Seeded Successfully!    ║
    ║                                        ║
    ║   👤 Users: ${createdUsers.length}                            ║
    ║   📁 Categories: ${createdCategories.length}                      ║
    ║   🛍️  Products: ${createdProducts.length}                       ║
    ║   📦 Inventory: ${inventoryData.length}                       ║
    ║                                        ║
    ║   Default Admin Credentials:          ║
    ║   Email: admin@cosmeticshop.com       ║
    ║   Password: Admin@123                 ║
    ║                                        ║
    ║   Test User:                           ║
    ║   Email: john@example.com             ║
    ║   Password: User@123                  ║
    ║                                        ║
    ╚════════════════════════════════════════╝
    `);

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Inventory.deleteMany();

    console.log("✅ Data destroyed successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error destroying data:", error);
    process.exit(1);
  }
};

// Run seeder based on command
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}

// Usage:
// npm run seed       -> Import data
// npm run seed -d    -> Destroy data
