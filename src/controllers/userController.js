import User from "../../models/User.js";

//ADD-USER=======================================================================
export async function addUser(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await User.hashPassword(password);
    const avatar = req.file?.filename || "";

    const user = new User({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    await user.save();

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };

    res.redirect("/");
  } catch (error) {
    next(error);
  }
}
