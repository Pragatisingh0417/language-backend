const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


const subscriptionRoutes = require("./routes/subscriptionRoutes");


const app = express();

app.use(cors());
app.use(express.json());

const deleteAccountRoutes = require("./routes/deleteAccount");
// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/languages", require("./routes/language"));
app.use("/api/delete-account", deleteAccountRoutes);

app.use(
  "/api/subscriptions",
  subscriptionRoutes
);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

  app.get("/", (req, res) => {
  res.send("API is running");
});


app.listen(5000, () => console.log("Server running on port 5000"));