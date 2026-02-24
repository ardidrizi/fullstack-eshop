const Product = require("../models/productModel");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const patchProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body);
    if (!product) {
      return res
        .status(404)
        .json({ message: `Cannot find the product with id ${id}` });
    }
    const updatedProduct = await Product.findById(id).select({
      name: 1,
      price: 1,
      category: 1,
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body);
    if (!product) {
      return res
        .status(404)
        .json({ message: `Cannot find the product with id ${id}` });
    }
    const updatedProduct = await Product.findById(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const addProductReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const rating = Number(req.body.rating);
    const comment = String(req.body.comment || "").trim();

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be an integer between 1 and 5" });
    }

    if (comment.length < 3 || comment.length > 1000) {
      return res
        .status(400)
        .json({ message: "Comment must be between 3 and 1000 characters" });
    }

    const alreadyReviewed = (product.reviews || []).find(
      (review) => String(review.user) === String(req.user._id)
    );

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating,
      comment,
      createdAt: new Date(),
    };

    product.reviews = [...(product.reviews || []), review];
    product.numReviews = product.reviews.length;
    product.ratings =
      product.reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) /
      product.numReviews;

    await Product.findByIdAndUpdate(req.params.id, {
      reviews: product.reviews,
      numReviews: product.numReviews,
      ratings: product.ratings,
    });

    return res.status(201).json({ message: "Review added" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// create a product
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: `Cannot find the product with id ${id}` });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({
      category: new RegExp(category, "i"),
    });
    if (!products) {
      return res
        .status(404)
        .json({ message: `Cannot find the category with id ${id}` });
    }
    res.status(200).json(products);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const searchProducts = async (req, res) => {
  const { keyword } = req.query; // Make sure keyword is coming through correctly
  try {
    const products = await Product.find({
      name: { $regex: keyword, $options: "i" }, // Case-insensitive search on 'name'
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in searchProducts:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getProducts,
  getProduct,
  updateProduct,
  createProduct,
  deleteProduct,
  patchProduct,
  getProductsByCategory,
  searchProducts,
  addProductReview,
};
