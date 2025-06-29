import fs from "fs/promises";
import createError from "http-errors";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

import Post from "../../models/Post.js";
import { io } from "../../webSocketServer.js";

//ADD-NEW-POST==========================================================================================
export async function newPost(req, res, next) {
  try {
    const { name, price, tag } = req.body;
    const userId = req.session.user.id;

    const photoFilename = req.file?.filename || "placeholder-image.jpg";

    const post = new Post({
      name,
      owner: userId,
      price,
      tag,
      photo: photoFilename,
    });

    await post.save();

    res.redirect("/my_posts");
    // if I use ‘res.render’, the last POST request will be resent.
    // so if I reload the page it will reinsert the last post.
  } catch (error) {
    next(createError(500, "Error creating post: " + error.message));
  }
}

//LIST-PRODUCTS=========================================================================================
export async function listPosts(req, res, next) {
  try {
    //Pagination of Posts--------------------------------------------------------
    const limit = parseInt(req.query.limit) || 6;
    const skip = parseInt(req.query.skip) || 0;
    const sort = "name";
    const tag = req.query.tag || "";
    const search = req.query.search || "";

    const filter = {};

    //Check if URL have "/my_posts"----------------------------------------------
    if (req.path === "/my_posts" && req.session.user) {
      filter.owner = req.session.user.id;
    }

    //Filter by name (case-insensitive)------------------------------------------
    if (search) {
      filter.name = { $regex: req.query.search, $options: "i" };
    }

    //Filter by Tag--------------------------------------------------------------
    if (tag) {
      filter.tag = tag;
    }

    const { posts, total } = await Post.list(filter, limit, skip, sort);

    //Manual Query Construction--------------------------------------------------
    const queryParams = [];
    if (req.query.search) queryParams.push(`search=${encodeURIComponent(req.query.search)}`);
    if (req.query.tag) queryParams.push(`tag=${encodeURIComponent(req.query.tag)}`);
    const baseQuery = queryParams.join("&");

    const view = req.path === "/my_posts" ? "my-posts" : "index";

    if (!posts) {
      throw new Error("No posts data found. 'posts' is undefined or null.");
    }

    //WEB-SOCKET***********************************************************************
    setTimeout(() => {
      const userId = req.session?.user?.id;
      if (userId) {
        console.log("SOCKET.IO: Sending Welcome Message to User With SessionId", req.session.id);
        io.to(req.session.id).emit("server-message", `welcome user ${userId}`);
      }
    }, 5000);
    //*********************************************************************************

    res.render(view, {
      posts,
      query: req.query,
      user: req.session.user,
      limit,
      skip,
      totalposts: total,
      baseQuery,
    });
  } catch (error) {
    next(createError(500, "Error listing posts: " + error.message));
  }
}

//UPDATE-POST===========================================================================================
//UPDATE-POST===========================================================================================
export async function editPost(req, res, next) {
  try {
    const userId = req.session.user.id;
    const postId = req.params.postId;

    const post = await Post.findOne({ _id: postId, owner: userId });

    if (!post) {
      return next(createError(404, `Post with ID ${postId} not found for user ${userId}`));
    }

    const { name, price, tag, existingPhoto } = req.body;

    // Si se sube una nueva imagen
    if (req.file) {
      const oldPhoto = post.photo;
      const newPhoto = req.file.filename;
      post.photo = newPhoto;

      if (oldPhoto && oldPhoto !== "placeholder-image.jpg") {
        const imagePath = path.resolve("public", "photos", oldPhoto);
        try {
          await fs.unlink(imagePath);
          console.log("Deleted old image:", oldPhoto);
        } catch (err) {
          console.warn("Failed to delete old image:", err.message);
        }
      }
    } else {
      // No se subió una imagen nueva → mantener la existente
      post.photo = existingPhoto;
    }

    post.name = name;
    post.price = price;
    post.tag = tag;

    await post.save();

    res.redirect("/my_posts");
  } catch (error) {
    next(createError(500, "Error updating post: " + error.message));
  }
}

//GET-POST-BY-ID========================================================================================
export async function getPostDetail(req, res, next) {
  try {
    const postId = req.params.postId;
    const userId = req.session.user.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return next(createError(404, "Post not found or not authorized"));
    }

    const postData = await Post.findOne({ _id: postId, owner: userId }).populate("owner", "name");

    if (!postData) {
      return next(createError(404, "Post not found or not authorized"));
    }

    res.render("post-detail", { post: postData, user: req.session.user });
  } catch (error) {
    next(error);
  }
}

//DELETE-POST===========================================================================================
export async function deletePost(req, res, next) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  try {
    if (!req.session.user) {
      return next(createError(401, "User not authenticated"));
    }
    const userId = req.session.user.id;
    const postId = req.params.postId;

    const post = await Post.findOne({ _id: postId, owner: userId });

    if (!post) {
      return next(createError(404, `post with ID ${postId} not found for user ${userId}`));
    }

    if (post.photo !== "placeholder-image.jpg") {
      const imagePath = path.join(__dirname, "..", "..", "public", "photos", post.photo);

      try {
        await fs.access(imagePath);
        await fs.unlink(imagePath);
        console.log("Deleted image:", imagePath);
      } catch (err) {
        if (err.code === "ENOENT") {
          console.warn("Image file not found, skipping delete:", imagePath);
        } else {
          console.error("Error deleting image:", err.message);
          return next(createError(500, "Error deleting post image"));
        }
      }
    }

    await post.deleteOne({ _id: postId, owner: userId });

    res.redirect("/my_posts");
  } catch (error) {
    next(createError(500, "Error deleting post: " + error.message));
  }
}
