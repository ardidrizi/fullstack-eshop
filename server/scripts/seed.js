require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");

const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;
const shouldClear = process.env.SEED_CLEAR === "true";
const requestedProductCount = Number.parseInt(process.env.SEED_COUNT_PRODUCTS || "40", 10);
const targetProductCount = Number.isNaN(requestedProductCount) ? 40 : Math.max(40, requestedProductCount);

const adminEmail = (process.env.DEMO_ADMIN_EMAIL || "admin@eshop.dev").toLowerCase();
const adminPassword = process.env.DEMO_ADMIN_PASSWORD || "Admin123!";
const demoUserEmail = (process.env.DEMO_USER_EMAIL || "demo.customer@eshop.dev").toLowerCase();
const demoUserPassword = process.env.DEMO_USER_PASSWORD || "Customer123!";
const secondUserEmail = (process.env.DEMO_USER_TWO_EMAIL || "alex.shopper@eshop.dev").toLowerCase();
const secondUserPassword = process.env.DEMO_USER_TWO_PASSWORD || "Shopper123!";

const categorySeeds = [
  {
    name: "Electronics",
    slug: "electronics",
    description: "Smart devices, accessories, and entertainment tech for everyday use.",
    tags: ["smart", "tech", "home"],
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    name: "Audio",
    slug: "audio",
    description: "Headphones, speakers, and pro-grade sound gear.",
    tags: ["sound", "music", "wireless"],
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    name: "Home & Kitchen",
    slug: "home-kitchen",
    description: "Cookware, appliances, and practical home essentials.",
    tags: ["kitchen", "home", "cook"],
    images: [
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1586208958839-06c17cacdf08?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    name: "Furniture",
    slug: "furniture",
    description: "Comfort-focused furniture for home office and living spaces.",
    tags: ["office", "living", "decor"],
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    name: "Fitness",
    slug: "fitness",
    description: "Workout equipment and recovery tools for active routines.",
    tags: ["gym", "wellness", "training"],
    images: [
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1594737625785-c76ef75f764b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    name: "Outdoors",
    slug: "outdoors",
    description: "Travel, camping, and adventure-ready gear.",
    tags: ["travel", "camp", "adventure"],
    images: [
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    name: "Beauty",
    slug: "beauty",
    description: "Skincare, personal care, and wellness favorites.",
    tags: ["skincare", "selfcare", "wellness"],
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523263685509-57c1d050d19b?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    name: "Books & Stationery",
    slug: "books-stationery",
    description: "Reading picks and desk essentials for productivity.",
    tags: ["reading", "study", "office"],
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80",
    ],
  },
];

const productTemplates = [
  ["Wireless Earbuds", 89], ["4K Action Camera", 239], ["Bluetooth Speaker", 119], ["Mechanical Keyboard", 129],
  ["Gaming Mouse", 79], ["USB-C Docking Station", 149], ["Smart Home Hub", 99], ["Portable SSD", 169],
  ["Noise-Cancelling Headphones", 229], ["Studio Microphone", 159], ["Soundbar", 299], ["Vinyl Record Player", 189],
  ["Espresso Machine", 349], ["Air Fryer", 129], ["Chef Knife Set", 99], ["Smart Blender", 179],
  ["Ergonomic Office Chair", 259], ["Standing Desk", 499], ["Floor Lamp", 89], ["Bookshelf", 149],
  ["Yoga Mat Pro", 49], ["Adjustable Dumbbell", 199], ["Fitness Tracker", 139], ["Resistance Band Set", 35],
  ["Camping Tent 4P", 279], ["Insulated Water Bottle", 32], ["Hiking Backpack", 159], ["Portable Camp Stove", 88],
  ["Hydrating Serum", 38], ["Hair Dryer Ionic", 69], ["Facial Cleansing Brush", 54], ["Sunscreen SPF 50", 24],
  ["Hardcover Notebook", 18], ["Fountain Pen Set", 45], ["Desk Organizer", 29], ["Reading Lamp", 42],
  ["Smartwatch Sport", 219], ["Robot Vacuum", 329], ["Ceramic Cookware Set", 189], ["Travel Duffel Bag", 95],
];

const shippingTemplates = [
  { name: "Mia Bennett", city: "Austin", state: "TX", postalCode: "73301" },
  { name: "Jordan Lee", city: "Seattle", state: "WA", postalCode: "98101" },
  { name: "Riley Carter", city: "Denver", state: "CO", postalCode: "80202" },
  { name: "Noah Kim", city: "Chicago", state: "IL", postalCode: "60601" },
  { name: "Avery Patel", city: "Portland", state: "OR", postalCode: "97201" },
];

function buildProducts(count) {
  const products = [];
  const daysSpread = 180;

  for (let index = 0; index < count; index += 1) {
    const template = productTemplates[index % productTemplates.length];
    const category = categorySeeds[index % categorySeeds.length];
    const imageCount = 2 + (index % 3);
    const images = [];

    for (let imageIndex = 0; imageIndex < imageCount; imageIndex += 1) {
      images.push(category.images[(index + imageIndex) % category.images.length]);
    }

    const [baseName, basePrice] = template;
    const variant = Math.floor(index / productTemplates.length) + 1;
    const name = variant > 1 ? `${baseName} Mk ${variant}` : baseName;
    const price = Number((basePrice + ((index % 5) * 7.5)).toFixed(2));
    const quantity = 8 + (index % 26);
    const createdAt = new Date(Date.now() - ((daysSpread - index) * 24 * 60 * 60 * 1000));

    products.push({
      name,
      description: `${name} is designed for ${category.name.toLowerCase()} shoppers looking for reliable quality, modern styling, and practical everyday performance.`,
      price,
      quantity,
      category: category.name,
      tags: [category.slug, ...category.tags, `featured-${(index % 6) + 1}`],
      images,
      createdAt,
      ratings: Number((3.8 + ((index % 12) * 0.1)).toFixed(1)),
      numReviews: 8 + (index % 90),
    });
  }

  return products;
}

async function upsertUsers() {
  const users = [
    {
      name: "Demo Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    },
    {
      name: "Demo Customer",
      email: demoUserEmail,
      password: demoUserPassword,
      role: "user",
    },
    {
      name: "Alex Shopper",
      email: secondUserEmail,
      password: secondUserPassword,
      role: "user",
    },
  ];

  let inserted = 0;

  for (const user of users) {
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      continue;
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    await User.create({
      name: user.name,
      email: user.email,
      password: hashedPassword,
      role: user.role,
    });
    inserted += 1;
  }

  const demoUser = await User.findOne({ email: demoUserEmail });
  return { inserted, demoUser };
}

async function seed() {
  if (!process.env.MONGO_URI && !process.env.MONGO_URL) {
    console.error("❌ Missing MongoDB connection string. Set MONGO_URI in your environment before running seed.");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);

    const products = buildProducts(targetProductCount);
    const seededCategories = categorySeeds.map((category) => category.slug);
    const seededProducts = products.map((product) => product.name);

    if (shouldClear) {
      await Promise.all([
        Category.deleteMany({ slug: { $in: seededCategories } }),
        Product.deleteMany({ name: { $in: seededProducts } }),
        User.deleteMany({ email: { $in: [adminEmail, demoUserEmail, secondUserEmail] } }),
        Order.deleteMany({ seedKey: { $regex: /^demo-order-/ } }),
      ]);
      console.log("🧹 Existing demo seed records cleared (SEED_CLEAR=true).");
    }


    const categoryResult = await Category.bulkWrite(
      categorySeeds.map((category) => ({
        updateOne: {
          filter: { slug: category.slug },
          update: { $setOnInsert: category },
          upsert: true,
        },
      }))
    );

    const productResult = await Product.bulkWrite(
      products.map((product) => ({
        updateOne: {
          filter: { name: product.name },
          update: { $setOnInsert: product },
          upsert: true,
        },
      }))
    );

    const { inserted: insertedUsers, demoUser } = await upsertUsers();

    if (!demoUser) {
      throw new Error("Unable to resolve demo customer user for order seeding.");
    }

    const allProducts = await Product.find({}).select("_id price").lean();
    const orderCount = 7;
    let insertedOrders = 0;

    for (let index = 0; index < orderCount; index += 1) {
      const seedKey = `demo-order-${index + 1}`;
      const existingOrder = await Order.findOne({ seedKey });
      if (existingOrder) {
        continue;
      }

      const itemCount = 2 + (index % 3);
      const startIndex = (index * 3) % allProducts.length;
      const items = [];

      for (let itemOffset = 0; itemOffset < itemCount; itemOffset += 1) {
        const product = allProducts[(startIndex + itemOffset) % allProducts.length];
        const quantity = 1 + ((index + itemOffset) % 2);
        items.push({
          product: product._id,
          quantity,
          price: product.price,
        });
      }

      const subtotal = Number(
        items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)
      );

      const address = shippingTemplates[index % shippingTemplates.length];

      await Order.create({
        user: demoUser._id,
        items,
        subtotal,
        status: ["pending", "processing", "completed"][index % 3],
        shippingAddress: {
          name: address.name,
          line1: `${100 + index} Market Street`,
          line2: "",
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: "USA",
        },
        seedKey,
      });

      insertedOrders += 1;
    }

    console.log("\n✅ Seed summary");
    console.log(`- Categories inserted: ${categoryResult.upsertedCount || 0}`);
    console.log(`- Products inserted: ${productResult.upsertedCount || 0}`);
    console.log(`- Users inserted: ${insertedUsers}`);
    console.log(`- Orders inserted: ${insertedOrders}`);
    console.log(`- Total categories in DB: ${await Category.countDocuments()}`);
    console.log(`- Total products in DB: ${await Product.countDocuments()}`);
    console.log(`- Total users in DB: ${await User.countDocuments()}`);
    console.log(`- Total orders in DB: ${await Order.countDocuments()}`);
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
