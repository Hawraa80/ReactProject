const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/Items", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("mongoose connected");
  })
  .catch((e) => {
    console.log("failed");
  });

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



const UserCollection = mongoose.model("users", usersSchema);

module.exports =  UserCollection;
