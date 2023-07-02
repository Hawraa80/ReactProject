const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/Items")
  .then(() => {
    console.log("mongoose connected");
  })
  .catch((e) => {
    console.log("failed");
  });


const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
});

const CategoryCollection = mongoose.model("Category", categorySchema);

module.exports =  CategoryCollection;
