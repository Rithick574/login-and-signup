const express = require("express");
const routes = express.Router();
const register = require("./server/database/connection");

//setting credential
const credential = {
  email: "admin@gmail.com",
  password: "1",
};

//routing to home page
routes.get("/", (req, res) => {
  if (req.session.logged) {
    res.redirect("/logged");
  } else {
    res.render("index", {
      title: "Login page",
      err: false,
      logout: false
    });
  }
});

//signup route
routes.get("/signup", (req, res) => {
  res.render("signup");
});

//signup credential post
routes.post("/signup", async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  const insert = await register.insertMany([data]);
  res.redirect("/logged");
});

//user login
routes.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const connect = await register.findOne({ email: email, password: password });
  if (connect) {
    console.log("login successful");
    req.session.user = req.body.email;
    req.session.logged = true;
    res.redirect("/logged");
  } else {
    console.log("log in failed...");
    res.render("index", { err: "invalid Username or Password" });
  }
});

//login user dash
routes.get("/logged", (req, res) => {
  if (!req.session.logged) {
    res.redirect("/");
  } else {
    res.render("userdash");
  }
});

//exit from user dash
routes.get("/exit", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

//admin login
routes.get("/admin_login", (req, res) => {
  if (!req.session.loggedIn) {
    const errr = "invalid Username or Password";
    res.render("adminlog", { errr: false });
  } else {
    res.redirect("/admin_home");
  }
});

//admin logindash
routes.post("/adminlogin", (req, res) => {
  console.log(req.body.email);
  console.log(req.body.password);
  if (
    req.body.email == credential.email &&
    req.body.password == credential.password
  ) {
    req.session.user = req.body.email;
    req.session.loggedIn = true;
    res.redirect("/admin_home");
  } else {
    const errr = "invalid Username or Password";
    res.render("adminlog", { errr });
  }
});

//admin dash
routes.get("/admin_home", async (req, res) => {
  if (req.session.loggedIn) {
    var i = 0;
    const useData = await register.find();
    console.log(useData);
    res.render("admin_dash", { title: "user details", useData, i });
  } else {
    res.redirect("/admin_login");
  }
});

//delete user
routes.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const deluser = await register.deleteOne({ _id: id });
  res.redirect("/admin_home");
});

//add user (insert)
routes.get("edit/:id", async (req, res) => {
  const id = req.params.id;
  const userData = await register.findOne({ _id: id });
  res.render("adduser", { title: "Edit User", userData });
});

//edit user get
routes.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const userData = await register.findOne({ _id: id });
  res.render("edituser", { title: "Edit User", userData });
});

//edited data of user post
routes.post("/update/:id", async (req, res) => {
  const dataOne = req.body;
  await register.updateOne(
    { _id: req.params.id },
    {
      $set: {
        name: dataOne.name,
        email: dataOne.email,
      },
    }
  );
  res.redirect("/admin_home");
});

//search user
routes.post("/search", async (req, res) => {
  var i = 0;
  const data = req.body;
  console.log(data);
  let useData = await register.find({
    name: { $regex: "^" + data.search, $options: "i" },
  });
  console.log(`search Data ${useData}`);
  res.render("admin_dash", {
    title: "Home",
    user: req.session.user,
    useData,
    i,
  });
});

//add user page
routes.get("/admin_control", (req, res) => {
  res.render("adduser");
});

routes.post("/signup2", async (req, res) => {
  const { name, email, password } = req.body;
  const insert = await register.create(req.body);
  res.redirect("/admin_home");
});

//admin panel exit
routes.get("/adminexit", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = routes;
