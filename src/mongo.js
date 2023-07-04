// Importing the Mongoose library
const mongoose = require("mongoose");

// Establishing a connection to a MongoDB database
mongoose
  .connect("mongodb://127.0.0.1:27017/Items", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("mongoose connected");
  })
  .catch((e) => {
    console.log("failed");
  });

// Creating a schema for the "users" collection
const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  mobilenumber: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: true,
  }
});

// Creating a model from the users schema
const UserCollection = mongoose.model("users", usersSchema);

// Exporting the UserCollection model
module.exports = UserCollection;
