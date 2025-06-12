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
import upload from "./src/middleware/uploadConfigure.js";

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
app.get("/", indexController.index);

//Product---------------------------------------------------------------------
app.post(
  "/new_product",
  upload.single("photo"),
  sessionManager.guard,
  indexController.postNew
);
app.get(
  "/delete/:productId",
  sessionManager.guard,
  indexController.deleteProduct
);

//Handling Errors=============================================================
// catch 404 and pass to error handler
app.use((req, res, next) => {
  next(createError(404));
});

//handle error
app.use((err, req, res) => {
  if (typeof err.array === "function") {
    err.message =
      "Invalid request: " +
      err
        .array()
        .map((e) => `${e.location} ${e.type} "${e.path}" ${e.msg}`)
        .join(", ");
    err.status = 422;
  }

  res.status(err.status || 500);

  //set local variables, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  //render error page
  res.render("error"); // my error.ejs file is sent and rendered
});

export default app;
