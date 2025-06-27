import Post from "../../../models/Post.js";
import { unlink } from "node:fs/promises";
import path from "node:path";
import createError from "http-errors";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// GET /api/posts
//List posts================================================================================

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get a list of posts for the authenticated user (Supports filtering).
 *     description: Returns a list of posts belonging to the authenticated user. Supports filtering by name or tag, pagination, sorting, and field selection.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter posts by name (case-insensitive, partial match).
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter posts by exact tag.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: "Maximum number of posts to return (default: 6)."
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *         description: Number of posts to skip (used for pagination).
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Field to sort the results by.
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Comma-separated list of fields to return.
 *       - in: query
 *         name: count
 *         schema:
 *           type: boolean
 *         description: If true, also returns the total count of matching documents.
 *     responses:
 *       200:
 *         description: A list of posts and optionally the total count.
 */
export async function listFilteredPosts(req, res, next) {
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

    const posts = await Post.list(filter, limit, skip, sort, fields);
    const result = { results: posts };

    if (withCount) {
      const count = await Post.countDocuments(filter);
      result.count = count;
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
}

// GET /api/posts/:postId
//Get One Post==============================================================================

/**
 * @swagger
 * /api/posts/{postId}:
 *   get:
 *     summary: Get a specific post by ID.
 *     description: Retrieves a single post that belongs to the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to retrieve.
 *     responses:
 *       200:
 *         description: The requested post.
 *       404:
 *         description: Post not found or does not belong to the user.
 */
export async function getPostById(req, res, next) {
  try {
    const postId = req.params.postId;
    const userId = req.apiUserId;

    const post = await Post.findOne({ _id: postId, owner: userId });

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
 *     summary: Create a new post.
 *     description: Creates a new post for the authenticated user. The image is optional; if none is uploaded, a default placeholder image ("image-placeholder.jpg") is assigned.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - tag
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product.
 *               price:
 *                 type: number
 *                 description: The price of the product.
 *               tag:
 *                 type: string
 *                 description: The tag or category of the product.
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Optional image file of the product.
 *     responses:
 *       201:
 *         description: Post created successfully.
 *       400:
 *         description: Invalid input data.
 */
export async function newPost(req, res, next) {
  try {
    const userId = req.apiUserId;
    const postData = req.body;

    const post = new Post({
      ...postData,
      owner: userId,
      photo: req.file?.filename || "placeholder-image.jpg",
    });

    const savedpost = await post.save();

    res.status(201).json({ result: savedpost });
  } catch (error) {
    next(error);
  }
}

// PUT /api/posts/:postId
//Update post===============================================================================

/**
 * @swagger
 * /api/posts/{postId}:
 *   put:
 *     summary: Update a post.
 *     security:
 *       - bearerAuth: []
 *     description: Updates a post that belongs to the authenticated user. If a new image is uploaded, it replaces the old one.
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to update.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               tag:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Post updated successfully.
 *       404:
 *         description: Post not found or not owned by the user.
 */
export async function updatePost(req, res, next) {
  try {
    const postId = req.params.postId;
    const userId = req.apiUserId;
    const postData = { ...req.body };
    if (req.file?.filename) {
      postData.photo = req.file.filename;
    }

    const updatedpost = await Post.findOneAndUpdate({ _id: postId, owner: userId }, postData, { new: true });

    if (!updatedpost) {
      return next(createError(404, "Post not Found or not Owned by User!"));
    }

    res.json({ result: updatedpost });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/posts/:postId
//Delete post===============================================================================

/**
 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     summary: Delete a post.
 *     description: Deletes a post that belongs to the authenticated user. If the post includes an image (other than the placeholder), the image file will be removed from the server.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to delete.
 *     responses:
 *       200:
 *         description: Post deleted successfully.
 *       401:
 *         description: Unauthorized. The post does not belong to the user.
 *       404:
 *         description: Post not found.
 */
export async function deletePost(req, res, next) {
  try {
    const postId = req.params.postId;
    const userId = req.apiUserId;

    const post = await Post.findById(postId);

    if (!post) {
      console.warn(`WARNING! user ${userId} is trying to delete non-existing post`);
      return next(createError(404));
    }

    if (post.owner.toString() !== userId) {
      console.warn(`WARNING! user ${userId} is trying to delete other users' posts`);
      return next(createError(401));
    }

    if (post.photo && post.photo !== "image-placeholder.jpg") {
      await unlink(path.join(__dirname, "..", "..", "public", "photos", post.photo));
    }

    await post.deleteOne({ _id: postId });

    res.json({ result: "Post Deleted Successfully!" });
  } catch (error) {
    next(error);
  }
}
