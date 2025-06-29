//import session from 'express-session'
import User from "../../models/User.js";
import { io } from "../../webSocketServer.js";

//RENDER-LOGIN-FORM=====================================================================================
export function renderLoginForm(req, res) {
  res.locals.email = "";
  res.render("login");
}

//LOG-IN================================================================================================
export async function handleLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    const redir = req.query.redir;

    const sessionId = req.session.id;

    if (!email || !password) {
      res.locals.error = "Please fill in all fields";
      res.locals.email = email || "";
      res.render("login");
      return;
    }

    const user = await User.findOne({ email: email });

    if (!user || !(await user.comparePassword(password))) {
      res.locals.error = "Invalid credentials";
      res.locals.email = email;
      res.render("login");
      return;
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };

    //WEB-SOCKET******************************************
    // send an email to the user
    /* await */ user.sendEmail("Welcome to NodePop.");
    //await user.sendEmail("Welcome", "Welcome to NodePop.");
    //****************************************************

    console.log("EXPRESS: Connecting to NodePop with SessionId ", sessionId);

    res.redirect(redir ? redir : "/");
  } catch (error) {
    next(error);
  }
}

//LOG-OUT===============================================================================================
export function handleLogout(req, res, next) {
  const oldSessionId = req.session.id;
  req.session.regenerate((err) => {
    if (err) {
      next(err);
      return;
    }

    //WEB-SOCKET******************************************
    io.in(oldSessionId).disconnectSockets();
    //****************************************************

    console.log("EXPRESS: Disconnecting from NodePop with SessionId ", oldSessionId);

    res.redirect("/");
  });
}
