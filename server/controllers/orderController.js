const Order = require("../models/orderModel");
const User = require("../models/userModel");

const getOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    "items.product"
  );
  res.status(200).json(orders);
};

const checkout = async (req, res) => {
  const user = await User.findById(req.user._id).populate("cart.product");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!user.cart.length) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const items = user.cart.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
    price: item.product.price,
  }));

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const order = await Order.create({
    user: user._id,
    items,
    subtotal,
    status: "processing",
    shippingAddress: req.body.shippingAddress,
  });

  user.cart = [];
  await user.save();

  res.status(201).json(order);
};

module.exports = { getOrders, checkout };
