require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Product = require("../models/productModel");
const User = require("../models/userModel");

const MONGO_URL = process.env.MONGO_URL;

const products = [
  {
    name: "Modern Laptop",
    description: "Lightweight laptop with fast performance and crisp display.",
    price: 1299,
    quantity: 12,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8"],
  },
  {
    name: "Noise Cancelling Headphones",
    description: "Comfortable headphones with rich sound and long battery life.",
    price: 249,
    quantity: 20,
    category: "Audio",
    images: ["https://images.unsplash.com/photo-1511379938547-c1f69419868d"],
  },
  {
    name: "Smartwatch Pro",
    description: "Track your fitness goals with style and smart notifications.",
    price: 199,
    quantity: 15,
    category: "Wearables",
    images: ["https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b"],
  },
  {
    name: "Home Office Chair",
    description: "Ergonomic chair with breathable mesh and lumbar support.",
    price: 189,
    quantity: 8,
    category: "Furniture",
    images: ["https://images.unsplash.com/photo-1501045661006-fcebe0257c3f"],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URL);

    await Product.deleteMany({});
    await User.deleteMany({});

    const hashedPassword = await bcrypt.hash("Admin123!", 10);
    const admin = await User.create({
      name: "Admin User",
      email: "admin@eshop.dev",
      password: hashedPassword,
      role: "admin",
    });

    await Product.insertMany(products);

    console.log("Seed complete");
    console.log("Admin login: admin@eshop.dev / Admin123!");
    console.log("Admin id:", admin._id.toString());
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
