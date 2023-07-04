// Importing required modules
const express = require("express");
const path = require("path");
const app = express();
const UserCollection = require("./mongo");
const CategoryCollection = require("./catmongo");
const { registerPartial } = require("hbs");

// Setting the port for the server
const port = process.env.PORT || 3000;

// Middleware configurations
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setting the template and public paths
const templatePath = path.join(__dirname, "../templates");
const publicPath = path.join(__dirname, "../public");

// Configuring the server to use Handlebars as the view engine
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.static(publicPath));

// Route for displaying the "category" view
app.get("/category", (req, res) => {
  res.render("category");
});

// Route for displaying the "user" view and fetching user data from the database
app.get("/user", async (req, res) => {
  try {
    const users = await UserCollection.find().maxTimeMS(15000);
    res.render("user", { users });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route for displaying the "Index" view and fetching category data from the database
app.get("/Index", async (req, res) => {
  try {
    const categories = await CategoryCollection.find();
    res.render("Index", { categories });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route for displaying the "user" view and fetching user data from the database
app.get("/", async (req, res) => {
  try {
    const users = await UserCollection.find().maxTimeMS(10000);
    res.render("user", { users });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route for adding a new user to the database
app.post("/Index", async (req, res) => {
  // Extracting user data from the request body
  const data = {
    name: req.body.name,
    description: req.body.description,
    mobilenumber: req.body.mobilenumber || null,
    category: ""
  };

  try {
    const checking = await UserCollection.findOne({ name: req.body.name });

    // Checking if the user already exists
    if (checking && checking.name === req.body.name) {
      res.send("<script>alert('User already exists'); window.location.href='/Index';</script>");
      return;
    } else {
      if (!req.body.category) {
        res.send("<script>alert('Invalid category'); window.location.href='/Index';</script>");
        return;
      }

      // Fetching the category from the database based on the provided category ID
      const category = await CategoryCollection.findById(req.body.category);

      if (!category) {
        res.send("<script>alert('Add Category'); window.location.href='/Index';</script>");
        return;
      }

      // Assigning the category name to the user data
      data.category = category.name;

      // Adding the user to the database
      res.send("<script>alert('User added successfully'); window.location.href='/';</script>");
      await UserCollection.insertMany([data]);
    }
  } catch (error) {
    res.send(error);
  }
});

// Route for fetching user details by ID
app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await UserCollection.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Send the user details as a JSON response
    res.send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route for adding a new category to the database
app.post("/category", async (req, res) => {
  const data = {
    name: req.body.name
  };

  try {
    const checking = await CategoryCollection.findOne({ name: req.body.name });

    // Checking if the category already exists
    if (checking && checking.name === req.body.name) {
      res.send("<script>alert('Category already exists'); window.location.href='/category';</script>");
      return;
    } else {
      // Adding the category to the database
      res.send("<script>alert('Category added successfully'); window.location.href='/';</script>");
      await CategoryCollection.insertMany([data]);
    }
  } catch (error) {
    res.send(error);
  }
});

// Route for updating user information by ID
app.put("/user/:id", async (req, res) => {
  const userId = req.params.id;
  const updates = req.body;

  try {
    const user = await UserCollection.findByIdAndUpdate(userId, updates, { new: true });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send("User information updated");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route for deleting a user by ID
app.delete("/user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await UserCollection.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).send("User not found");
    }

    res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
