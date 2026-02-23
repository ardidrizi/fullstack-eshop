require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, HOST, () => {
      console.log(`Node API server listening on ${HOST}:${PORT} (${process.env.NODE_ENV || "development"})`);
    });
  })
  .catch((err) => {
    console.log("Error: ", err);
  });
