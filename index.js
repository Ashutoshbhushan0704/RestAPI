const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = express.Router();

app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/users", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

// CRUD operations

// Create user
app.post("/users", (req, res) => {
  const newUser = new User({
    name: req.body.name,
    password: req.body.password,
    role: req.body.role,
  });

  newUser
    .save()
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json({ err }));
});

// Read user
app.get("/users/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    })
    .catch((err) => res.status(400).json({ error: "Unable to retrieve user" }));
});

// Update user
app.put("/users/:id", (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    })
    .catch((err) => res.status(400).json({ error: "Unable to update user" }));
});

// Delete user
app.delete("/users/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ success: "User deleted" });
    })
    .catch((err) => res.status(400).json({ error: "Unable to delete user" }));
});

// User list with pagination
app.get("/users", (req, res) => {
  const pageSize = 10;
  const page = req.query.page || 1;

  User.find()
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .then(users => res.json(users))
    .catch(err => res.status(500).json({message: 'Error fetching users', error: err}));
});
    const csv = require('fast-csv');
    const fs = require('fs');
    
    router.get('/users/csv', (req, res) => {
        User.find()
            .then(users => {
                const csvStream = csv.createWriteStream({headers: true});
                const writableStream = fs.createWriteStream('./users.csv');
    
                writableStream.on("finish", function(){
                    res.download('./users.csv', 'users.csv');
                });
    
                csvStream.pipe(writableStream);
                users.forEach(user => csvStream.write(user));
                csvStream.end();
            })
            .catch(err => res.status(500).json({message: 'Error exporting users to CSV', error: err}));
    });
    app.get("/", function(req, res){
        res.sendFile(__dirname+"/landing.html");
        });
    app.listen(process.env.PORT||3000, function() {
        console.log("Server started");
      });
      
    