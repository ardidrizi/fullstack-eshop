const express = require("express");
const { getOrders, checkout } = require("../controllers/orderController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);
router.get("/", getOrders);
router.post("/checkout", checkout);

module.exports = router;
