require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;

if (!mongoUri) {
  console.error("Missing MongoDB connection string. Set MONGO_URI (or MONGO_URL for backward compatibility).");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, HOST, () => {
      console.log(`Node API server listening on ${HOST}:${PORT} (${process.env.NODE_ENV || "development"})`);
    });
  })
  .catch((err) => {
    console.log("Error: ", err);
  });
