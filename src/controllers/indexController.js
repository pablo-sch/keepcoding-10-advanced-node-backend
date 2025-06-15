import fs from "fs/promises";
import path from "path";

import createError from "http-errors";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import Product from "../../models/Product.js";
//import User from "../../models/User.js";

//List All Products==============================================================
export async function listProducts(req, res, next) {
  try {
    //Pagination of Posts--------------------------------------------------------
    const limit = parseInt(req.query.limit) || 6;
    const skip = parseInt(req.query.skip) || 0;
    const sort = /* req.query.sort || */ "name";
    const tag = req.query.tag || "";
    const search = req.query.search || "";
    const myPosts = req.query.myPosts === "true";

    const filter = {};

    //checkbox show only post of logged in User----------------------------------
    if (myPosts && req.session.user) {
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

    const { products, total } = await Product.list(filter, limit, skip, sort);

    //Manual Query Construction--------------------------------------------------
    const queryParams = [];

    if (req.query.search)
      queryParams.push(`search=${encodeURIComponent(req.query.search)}`);
    if (req.query.tag)
      queryParams.push(`tag=${encodeURIComponent(req.query.tag)}`);
    if (req.query.myPosts === "true") queryParams.push(`myPosts=true`);

    const baseQuery = queryParams.join("&");

    res.render("index", {
      products,

      // VVV To keep selected values
      query: req.query,
      user: req.session.user,
      limit,
      skip,
      totalProducts: total,
      baseQuery,
    });
  } catch (error) {
    next(error);
  }
}

//List Logged User Products Only================================================
/* 
export async function listUserProducts(req, res, next) {
  try {
    const userId = req.session.user.id;

    const products = await Product.find({ owner: userId }).populate(
      "owner",
      "name"
    );

    res.render("index", { products, query: req.query });
  } catch (error) {
    next(error);
  }
} */

//deleteProduct Middleware=======================================================
export async function deleteProduct(req, res, next) {
  try {
    const userId = req.session.user.id;
    const productId = req.params.productId;

    const product = await Product.findOne({ _id: productId, owner: userId });

    if (!product) {
      return next(
        createError(
          404,
          `Product with ID ${productId} not found for user ${userId}`
        )
      );
    }

    if (product.photo) {
      const imagePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "photos",
        product.photo
      );

      try {
        await fs.unlink(imagePath);
        console.log("Image deleted:", imagePath);
      } catch (err) {
        console.error("Error deleting image:", err.message);
        return next(createError(500, "Error when deleting the image"));
      }
    }

    await Product.deleteOne({ _id: productId, owner: userId });

    res.redirect("/");
  } catch (error) {
    next(error);
  }
}
