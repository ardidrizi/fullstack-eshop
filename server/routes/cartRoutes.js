const express = require("express");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);
router.get("/", getCart);
router.post("/", addToCart);
router.put("/", updateCartItem);
router.delete("/clear", clearCart);
router.delete("/:productId", removeCartItem);

module.exports = router;
