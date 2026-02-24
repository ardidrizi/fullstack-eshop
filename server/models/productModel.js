const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
          trim: true,
        },
        rating: {
          type: Number,
          required: true,
          min: [1, "Rating must be at least 1"],
          max: [5, "Rating cannot exceed 5"],
        },
        comment: {
          type: String,
          required: true,
          trim: true,
          minlength: [3, "Comment must be at least 3 characters long"],
          maxlength: [1000, "Comment cannot exceed 1000 characters"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    name: {
      type: String,
      required: [true, "Please enter the product name"],
      trim: true,
      minlength: [3, "Product name must be at least 3 characters long"],
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please enter the product description"],
      minlength: [10, "Description must be at least 10 characters long"],
    },
    price: {
      type: Number,
      required: [true, "Please enter the product price"],
      min: [0, "Price must be a positive number"],
    },
    quantity: {
      type: Number,
      required: [true, "Please enter the product quantity"],
      default: 0,
      min: [0, "Quantity cannot be less than 0"],
    },
    category: {
      type: String,
      required: [true, "Please select a category for the product"],
    },
    images: [
      {
        type: String, // URL to the image
        required: true,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    ratings: {
      type: Number,
      default: 0,
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating cannot exceed 5"],
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
