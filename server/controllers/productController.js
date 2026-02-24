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

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating,
      comment,
      createdAt: new Date(),
    };

    const result = await Product.updateOne(
      {
        _id: req.params.id,
        "reviews.user": { $ne: req.user._id },
      },
      [
        {
          $set: {
            reviews: { $ifNull: ["$reviews", []] },
            numReviews: { $ifNull: ["$numReviews", 0] },
            ratings: { $ifNull: ["$ratings", 0] },
          },
        },
        {
          $set: {
            reviews: { $concatArrays: ["$reviews", [review]] },
            numReviews: { $add: ["$numReviews", 1] },
            ratings: {
              $round: [
                {
                  $divide: [
                    {
                      $add: [
                        { $multiply: ["$ratings", "$numReviews"] },
                        rating,
                      ],
                    },
                    { $add: ["$numReviews", 1] },
                  ],
                },
                1,
              ],
            },
          },
        },
      ]
    );

    if (result.matchedCount === 0) {
      const productExists = await Product.exists({ _id: req.params.id });
      if (!productExists) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

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
