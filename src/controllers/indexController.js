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
    //res.render(‘index’, { title: ‘Express’ }); // --> The variable ‘title’ in my index.ejs will be called by ‘Express’.
    //res.locals.title = Express // --> same as above

    if (req.query.myPosts === "true" && req.session.user.id) {
      return listUserProducts(req, res, next);
    }

    //const userId = req.session.userId;
    const products = await Product.find().populate("owner", "name");

    res.render("index", {
      products,
      query: req.query,
    });
  } catch (error) {
    next(error);
  }
}

//List Logged User Products Only================================================
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
}

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
