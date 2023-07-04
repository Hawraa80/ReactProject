// Importing the Mongoose library
const mongoose = require("mongoose");

// Connecting to a MongoDB database
mongoose.connect("mongodb://127.0.0.1:27017/Items")
  .then(() => {
    // Connection successful
    console.log("mongoose connected");
  })
  .catch((e) => {
    // Connection failed
    console.log("failed");
  });

// Defining a category schema using Mongoose
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
});

// Creating a model from the category schema
const CategoryCollection = mongoose.model("Category", categorySchema);

// Exporting the CategoryCollection model
module.exports = CategoryCollection;
