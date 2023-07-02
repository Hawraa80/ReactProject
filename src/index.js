const express = require("express");
const path = require("path");
const app = express();
const UserCollection = require("./mongo");
const CategoryCollection = require("./catmongo");
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const templatePath = path.join(__dirname, "../templates");
const publicPath = path.join(__dirname, "../public");

app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.static(publicPath));



app.get("/category", (req, res) => {
  res.render("category");
});



app.get("/user", async (req, res) => {
  try {
    const users = await UserCollection.find().maxTimeMS(15000);
    res.render("user", { users });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/Index", async (req, res) => {
  try {
    const categories = await CategoryCollection.find();
    res.render("Index", { categories });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.get("/", async (req, res) => {
  try {
    const users = await UserCollection.find().maxTimeMS(10000);
    res.render("user", { users });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/Index", async (req, res) => {
  const data = {
    name: req.body.name,
    description: req.body.description,
    mobilenumber: req.body.mobilenumber || null,
    category: ""
  };

  try {
    const checking = await UserCollection.findOne({ name: req.body.name });

    if (checking && checking.name === req.body.name) {
      res.send("<script>alert('User already exists'); window.location.href='/Index';</script>");
      return;
    } else {
      const category = await CategoryCollection.findById(req.body.category);
      
      if (!category) {
        res.send("<script>alert('Invalid category'); window.location.href='/Index';</script>");
        return;
      }
      
      data.category = category.name;

      res.send("<script>alert('User added successfully'); window.location.href='/';</script>");
      await UserCollection.insertMany([data]);
    }
  } catch (error) {
    res.send(error);
  }
});


app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await UserCollection.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send(user); // Send the user details as a JSON response
  } catch (error) {
    res.status(500).send(error.message);
  }
});



app.post("/category", async (req, res) => {
  const data = {
    name: req.body.name
  };

  try {
    const checking = await CategoryCollection.findOne({ name: req.body.name });

    if (checking && checking.name === req.body.name) {
      res.send("<script>alert('Category already exists'); window.location.href='/category';</script>");
      return;
    } else {
      res.send("<script>alert('Category added successfully'); window.location.href='/';</script>");
      await CategoryCollection.insertMany([data]);
     
    }
  } catch (error) {
    res.send(error);
  }
});

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
