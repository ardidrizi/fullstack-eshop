const express = require("express");
const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/adminProductController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth, requireAdmin);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
