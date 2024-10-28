require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");
const PORT = process.env.PORT || 3000;
const MOGNO_URL = process.env.MONGO_URL;
const morgan = require("morgan");
const app = express();
app.use(morgan("dev"));
// Middleware

const corsOptions = {
  origin: ["http://localhost:5173"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ extended: false }));
// Connect to MongoDB
mongoose
  .connect(MOGNO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Node Api server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error: ", err);
  });

app.use("/api/products", productRoutes);
