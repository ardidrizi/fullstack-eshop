const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProduct,
  updateProduct,
  createProduct,
  deleteProduct,
  getProductsByCategory,
  searchProducts,
} = require("../controllers/productController");

// Define the router
// Get all
router.get("/", getProducts);
router.post("/", createProduct);
router.get("/search", searchProducts);

router.delete("/:id", deleteProduct);
// Get a single with id
router.get("/:id", getProduct);

// Update
router.put("/:id", updateProduct);

// Patch
router.patch("/:id", updateProduct);

// Delete

// Create

router.get("/categories/:category", getProductsByCategory);

module.exports = router;
