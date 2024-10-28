require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");
const PORT = process.env.PORT || 3000;
const MOGNO_URL = process.env.MONGO_URL;
const morgan = require("morgan");
const app = express();
const path = require("path");

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

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
app.use((req, res, next) => {
  if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
    next();
  } else {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    res.sendFile(path.join(__dirname, "public", "index.html"));
  }
});
