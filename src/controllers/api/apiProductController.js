import Product from "../../models/Product.js";
import { unlink } from "node:fs/promises";
import path from "node:path";
import createError from "http-errors";

// GET /api/products
//List Products================================================================================

/**
 * @swagger
 * /api/products:
 *   get:
 *     description: Return a list of products
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
export async function list(req, res, next) {
  try {
    const userId = req.apiUserId;

    const filter = { owner: userId };

    // Filters-------------------------------------------------
    const { name, tag } = req.query;
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }
    if (tag) {
      filter.tag = tag;
    }

    // Pagination----------------------------------------------
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    // Sorting-------------------------------------------------
    const sort = req.query.sort;

    // Field selection-----------------------------------------
    const fields = req.query.fields;

    // With total count----------------------------------------
    const withCount = req.query.count === "true";

    const products = await Product.list(filter, limit, skip, sort, fields);
    const result = { results: products };

    if (withCount) {
      const count = await Product.countDocuments(filter);
      result.count = count;
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
}

// GET /api/products/:productId
//Get One Product==============================================================================

export async function getProduct(req, res, next) {
  try {
    const productId = req.params.productId;
    const userId = req.apiUserId;

    const product = await Product.findOne({ _id: productId, owner: userId });

    if (!product) {
      return next(createError(404, "Product not found"));
    }

    res.json({ result: product });
  } catch (error) {
    next(error);
  }
}

// POST /api/products
//Create Product===============================================================================

/**
 * @swagger
 * /api/products:
 *   post:
 *     description: Create a new product
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
export async function newProduct(req, res, next) {
  try {
    const userId = req.apiUserId;
    const productData = req.body;

    const product = new Product({
      ...productData,
      owner: userId,
      photo: req.file?.filename || "image-placeholder.jpg",
    });

    const savedProduct = await product.save();

    res.status(201).json({ result: savedProduct });
  } catch (error) {
    next(error);
  }
}

// PUT /api/products/:productId
//Update Product===============================================================================

export async function update(req, res, next) {
  try {
    const productId = req.params.productId;
    const userId = req.apiUserId;
    const productData = {
      ...req.body,
      photo: req.file?.filename,
    };

    const updatedProduct = await Product.findOneAndUpdate({ _id: productId, owner: userId }, productData, { new: true });

    if (!updatedProduct) {
      return next(createError(404, "Product not found or not owned by user"));
    }

    res.json({ result: updatedProduct });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/products/:productId
//Delete Product===============================================================================

export async function deleteProduct(req, res, next) {
  try {
    const productId = req.params.productId;
    const userId = req.apiUserId;

    const product = await Product.findById(productId);

    if (!product) {
      console.warn(`WARNING! user ${userId} is trying to delete non-existing product`);
      return next(createError(404));
    }

    if (product.owner.toString() !== userId) {
      console.warn(`WARNING! user ${userId} is trying to delete other users' products`);
      return next(createError(401));
    }

    if (product.photo && product.photo !== "image-placeholder.jpg") {
      await unlink(path.join(import.meta.dirname, "..", "..", "public", "photos", product.photo));
    }

    await Product.deleteOne({ _id: productId });

    res.json();
  } catch (error) {
    next(error);
  }
}
