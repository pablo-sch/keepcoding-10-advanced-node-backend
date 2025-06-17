import fs from "fs/promises";
import path from "path";
import createError from "http-errors";

import Product from "../../models/Product.js";

//Add New Product==========================================================================================
export async function newProduct(req, res, next) {
  try {
    const { name, price, tag } = req.body;
    const userId = req.session.user.id;

    const photoFilename = req.file?.filename || "placeholder-image.jpg";

    const product = new Product({
      name,
      owner: userId,
      price,
      tag,
      photo: photoFilename,
    });

    await product.save();

    res.redirect("/");
    // if I use ‘res.render’, the last POST request will be resent.
    // so if I reload the page it will reinsert the last product.
  } catch (error) {
    next(createError(500, "Error creating product: " + error.message));
  }
}

//List All Products========================================================================================
export async function listProducts(req, res, next) {
  try {
    //Pagination of Posts--------------------------------------------------------
    const limit = parseInt(req.query.limit) || 6;
    const skip = parseInt(req.query.skip) || 0;
    const sort = "name";
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

    if (req.query.search) queryParams.push(`search=${encodeURIComponent(req.query.search)}`);
    if (req.query.tag) queryParams.push(`tag=${encodeURIComponent(req.query.tag)}`);
    if (req.query.myPosts === "true") queryParams.push(`myPosts=true`);

    const baseQuery = queryParams.join("&");

    res.render("index", {
      products,
      query: req.query,
      user: req.session.user,
      limit,
      skip,
      totalProducts: total,
      baseQuery: buildQueryParams(req.query),
    });
  } catch (error) {
    next(createError(500, "Error listing products: " + error.message));
  }
}
function buildQueryParams(query) {
  const queryParams = [];
  if (query.search) queryParams.push(`search=${encodeURIComponent(query.search)}`);
  if (query.tag) queryParams.push(`tag=${encodeURIComponent(query.tag)}`);
  if (query.myPosts === "true") queryParams.push("myPosts=true");
  return queryParams.join("&");
}

//List Logged User Products Only==========================================================================
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

//Delete Product===========================================================================================
export async function deleteProduct(req, res, next) {
  try {
    if (!req.session.user) {
      return next(createError(401, "User not authenticated"));
    }
    const userId = req.session.user.id;
    const productId = req.params.productId;

    const product = await Product.findOne({ _id: productId, owner: userId });

    if (!product) {
      return next(createError(404, `Product with ID ${productId} not found for user ${userId}`));
    }

    if (product.photo && product.photo !== "placeholder-image.jpg") {
      try {
        const imagePath = path.join(import.meta.url, "..", "..", "public", "photos", product.photo);
        await fs.unlink(imagePath);
        console.log("Image deleted:", imagePath);
      } catch (err) {
        console.error("Error deleting image:", err.message);
        return next(createError(500, "Error deleting product image"));
      }
    }

    await Product.deleteOne({ _id: productId, owner: userId });

    res.redirect("/");
  } catch (error) {
    next(createError(500, "Error deleting product: " + error.message));
  }
}
