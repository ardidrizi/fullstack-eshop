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
const { requireAuth, requireAdmin } = require("../middleware/auth");

// Define the router
// Get all
router.get("/", getProducts);
router.post("/", requireAuth, requireAdmin, createProduct);
router.get("/search", searchProducts);

router.delete("/:id", requireAuth, requireAdmin, deleteProduct);
// Get a single with id
router.get("/:id", getProduct);

// Update
router.put("/:id", requireAuth, requireAdmin, updateProduct);

// Patch
router.patch("/:id", requireAuth, requireAdmin, updateProduct);

// Delete

// Create

router.get("/categories/:category", getProductsByCategory);

module.exports = router;
