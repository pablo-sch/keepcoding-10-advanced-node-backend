/* eslint-disable no-unused-vars */
//CommomJS (default) --> ES Modules--------------------------------------------------------------

// 1st Express/Node libraries
import createError from "http-errors";
import express from "express";
import path from "path";

// 2nd Third-party libraries
import cookieParser from "cookie-parser";
import logger from "morgan";

// 3rd Own libraries
import connectMongoose from "./lib/connectMongoose.js";
import * as sessionManager from "./lib/sessionManager.js";

import * as indexController from "./src/controllers/indexController.js";
import * as loginController from "./src/controllers/loginController.js";
import * as productController from "./src/controllers/productController.js";
import * as userController from "./src/controllers/userController.js";

import uploadPhotos from "./src/middleware/uploadPhotos.js";
import uploadAvatars from "./src/middleware/uploadAvatars.js";

//Connect to MongoDB=========================================================
await connectMongoose();

const app = express();

//Configuring the view engine=================================================
app.set("views", "views");
app.set("view engine", "ejs");

//Global Parameters===========================================================
app.locals.appName = "NodePoP"; // --> any variable with the name ‘appName’ in my .ejs will be named ‘NodePoP’.

//Static Middleware===========================================================
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(import.meta.dirname, "public")));

//My Application Routes=======================================================

//sessionManager--------------------------------------------------------------
app.use(sessionManager.middleware);
app.use(sessionManager.useSessionInViews);

//Login-----------------------------------------------------------------------
app.post("/login", loginController.postLogin);
app.get("/login", loginController.index);
app.get("/logout", loginController.logout);

//Index-----------------------------------------------------------------------
app.get("/", indexController.listProducts);

//Product---------------------------------------------------------------------
app.post(
  "/new_product",
  uploadPhotos.single("photo"),
  sessionManager.guard,
  productController.postNew
);
app.get("/new_product", sessionManager.guard, (req, res) => {
  res.render("product", { session: req.session });
});
app.get(
  "/delete/:productId",
  sessionManager.guard,
  indexController.deleteProduct
);

//User------------------------------------------------------------------------
app.post(
  "/new_user",
  uploadAvatars.single("avatar"),
  sessionManager.guard,
  userController.createNew
);
app.get("/new_user", sessionManager.guard, (req, res) => {
  res.render("user", { session: req.session });
});

//Handling Errors=============================================================
// catch 404 and pass to error handler
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

//handle error
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

export default app;
