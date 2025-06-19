/* eslint-disable no-unused-vars */
//CommomJS (default) --> ES Modules--------------------------------------------------------------

// 1st Express/Node libraries
import createError from "http-errors";
import express from "express";
import path from "path";
import "dotenv/config";

// 2nd Third-party libraries
import cookieParser from "cookie-parser";
import logger from "morgan";

// 3rd Own libraries
import connectMongoose from "./lib/connectMongoose.js";
import * as sessionManager from "./lib/sessionManager.js";

import i18n from "./lib/i18nConfigure.js";
import swaggerMiddleware from "./lib/swaggerMiddleware.js";

//import * as indexController from "./src/controllers/indexController.js";
import * as loginController from "./src/controllers/loginController.js";
import * as postController from "./src/controllers/postController.js";
import * as userController from "./src/controllers/userController.js";

import uploadPhotos from "./src/middleware/uploadPhotos.js";
import uploadAvatars from "./src/middleware/uploadAvatars.js";

import * as localeController from "./src/controllers/localeController.js";

//import * as apipostController from "./src/controllers/api/apipostController.js";
//import * as apiLoginController from "./src/controllers/api/apiLoginController.js";

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
//API Routes------------------------------------------------------------------
/* 
app.get("/api/posts", apipostController.list);
app.get('/api/posts/:postsId', apipostController.getOne)
app.post('/api/posts', upload.single('avatar'), apipostController.newpost)
 */

//Dependences---------------------------------------------------------------------
app.use(cookieParser());
app.use("/api-doc", swaggerMiddleware);

app.use(i18n.init);
app.get("/change-locale/:locale", localeController.changeLocale);

//sessionManager--------------------------------------------------------------
app.use(sessionManager.middleware);
app.use(sessionManager.useSessionInViews);

//Login-----------------------------------------------------------------------
app.post("/login", loginController.postLogin);
app.get("/login", loginController.index);
app.get("/logout", loginController.logout);

//Post---------------------------------------------------------------------
app.get("/", postController.listPosts);
app.get("/my_posts", sessionManager.guard, postController.listPosts);

app.post("/new_post", uploadPhotos.single("photo"), sessionManager.guard, postController.newPost);

app.get("/new_post", sessionManager.guard, (req, res) => {
  res.render("post", { session: req.session });
});

//app.delete("/api/posts/:postId", sessionManager.guard, postController.deletepost);
app.get("/delete/:postId", sessionManager.guard, postController.deletePost);

app.get("/post_detail/:postId", sessionManager.guard, postController.getPostDetail);

app.post("/post_detail/:postId", sessionManager.guard, uploadPhotos.single("photo"), postController.editPost);

//User------------------------------------------------------------------------
app.post("/new_user", uploadAvatars.single("avatar"), userController.newUser);
app.get("/new_user", (req, res) => {
  res.render("user", { session: req.session });
});

//Handling Errors=============================================================
// Catch 404 error and pass to handler error----------------------------------
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  console.warn("404 Not Found:", req.method, req.originalUrl);
  next(error);
});

//Handle Error----------------------------------------------------------------
app.use((err, req, res, next) => {
  //Server Console Response
  console.error("Error:", err);

  //Set the HTTP status code
  const statusCode = err.status || 500;
  res.status(statusCode);

  //Handle validation errors
  if (err.array) {
    err.message =
      "Invalid request: " +
      err
        .array()
        .map((e) => `${e.location} ${e.type} "${e.path}" ${e.msg}`)
        .join(", ");
    err.status = 422;
  }

  //JSON Error Response (for API routes)
  if (req.originalUrl.startsWith("/api/")) {
    return res.json({
      error: err.message || "Unexpected error",
      status: statusCode,
    });
  }

  //.ejs Error View Response
  res.render("error", {
    message: err.message,
    status: err.status || 500,
  });
});

export default app;
