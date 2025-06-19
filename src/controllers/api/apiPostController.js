import post from "../../models/post.js";
import { unlink } from "node:fs/promises";
import path from "node:path";
import createError from "http-errors";

// GET /api/posts
//List posts================================================================================

/**
 * @swagger
 * /api/posts:
 *   get:
 *     description: Return a list of posts
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

    const posts = await post.list(filter, limit, skip, sort, fields);
    const result = { results: posts };

    if (withCount) {
      const count = await post.countDocuments(filter);
      result.count = count;
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
}

// GET /api/posts/:postId
//Get One post==============================================================================

export async function getpost(req, res, next) {
  try {
    const postId = req.params.postId;
    const userId = req.apiUserId;

    const post = await post.findOne({ _id: postId, owner: userId });

    if (!post) {
      return next(createError(404, "post not found"));
    }

    res.json({ result: post });
  } catch (error) {
    next(error);
  }
}

// POST /api/posts
//Create post===============================================================================

/**
 * @swagger
 * /api/posts:
 *   post:
 *     description: Create a new post
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
export async function newpost(req, res, next) {
  try {
    const userId = req.apiUserId;
    const postData = req.body;

    const post = new post({
      ...postData,
      owner: userId,
      photo: req.file?.filename || "image-placeholder.jpg",
    });

    const savedpost = await post.save();

    res.status(201).json({ result: savedpost });
  } catch (error) {
    next(error);
  }
}

// PUT /api/posts/:postId
//Update post===============================================================================

export async function update(req, res, next) {
  try {
    const postId = req.params.postId;
    const userId = req.apiUserId;
    const postData = {
      ...req.body,
      photo: req.file?.filename,
    };

    const updatedpost = await post.findOneAndUpdate({ _id: postId, owner: userId }, postData, { new: true });

    if (!updatedpost) {
      return next(createError(404, "post not found or not owned by user"));
    }

    res.json({ result: updatedpost });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/posts/:postId
//Delete post===============================================================================

export async function deletepost(req, res, next) {
  try {
    const postId = req.params.postId;
    const userId = req.apiUserId;

    const post = await post.findById(postId);

    if (!post) {
      console.warn(`WARNING! user ${userId} is trying to delete non-existing post`);
      return next(createError(404));
    }

    if (post.owner.toString() !== userId) {
      console.warn(`WARNING! user ${userId} is trying to delete other users' posts`);
      return next(createError(401));
    }

    if (post.photo && post.photo !== "image-placeholder.jpg") {
      await unlink(path.join(import.meta.dirname, "..", "..", "public", "photos", post.photo));
    }

    await post.deleteOne({ _id: postId });

    res.json();
  } catch (error) {
    next(error);
  }
}
