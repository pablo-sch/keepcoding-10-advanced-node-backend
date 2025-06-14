//import session from 'express-session'
import User from "../../models/User.js";

export function index(req, res) {
  res.locals.error = "";
  res.locals.email = "";
  res.render("login");
}

export async function postLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    const redir = req.query.redir;

    // search for the user in the database
    const user = await User.findOne({ email: email });

    // if I can't find it, or the password doesn't match --> error
    if (!user || !(await user.comparePassword(password))) {
      res.locals.error = "Invalid credentials";
      res.locals.email = email; // with this line we will keep the email variable when reloading the page in case of a wrong input
      res.render("login");
      return;
    }

    // if the user exists and the password is good --> redirect to the home page
    req.session.userId = user.id;
    // the user id found in the database is assigned to the session effected by the LogIn.

    req.session.userName = user.name;

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };

    res.redirect(redir ? redir : "/");
  } catch (error) {
    next(error);
  }
}

export function logout(req, res, next) {
  req.session.regenerate((err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect("/");
  });
}
