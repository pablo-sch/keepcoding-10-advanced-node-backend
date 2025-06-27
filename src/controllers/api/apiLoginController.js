import jwt from "jsonwebtoken";
import User from "../../../models/User.js";
import createError from "http-errors";

// POST /api/login
// Login with email & password, return JWT token and user info

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login user and return JWT token
 *     description: Authenticates the user with email and password and returns a JWT token along with user info.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password.
 *     responses:
 *       200:
 *         description: Login successful, returns JWT and user info.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 tokenJWT:
 *                   type: string
 *                   description: JWT token for authenticated requests.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: User ID.
 *                     name:
 *                       type: string
 *                       description: User's name.
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: User's email.
 *                     avatar:
 *                       type: string
 *                       description: URL or filename of user's avatar.
 *       401:
 *         description: Invalid credentials.
 */
export async function loginJWT(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return next(createError(401, "Invalid credentials"));
    }

    jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, { expiresIn: "2d" }, (err, tokenJWT) => {
      if (err) return next(err);
      res.json({
        message: "Login successful",
        tokenJWT,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      });
    });
  } catch (error) {
    next(error);
  }
}
