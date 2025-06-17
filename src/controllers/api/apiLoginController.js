import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import createError from "http-errors";

export async function loginJWT(req, res, next) {
  try {
    const { email, password } = req.body;

    // buscar el usuario en la base de datos
    const user = await User.findOne({ email: email });

    // si no lo encuentro, o la contraseña no coincide --> error
    if (!user || !(await user.comparePassword(password))) {
      next(createError(401, "invalid credentials"));
      return;
    }

    // si el usuario existe y la contraseña es buena --> generar un JWT y devolverselo
    jwt.sign(
      { user_id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      },
      (err, tokenJWT) => {
        if (err) {
          return next(err);
        }
        res.json({ tokenJWT });
      }
    );
  } catch (error) {
    next(error);
  }
}
