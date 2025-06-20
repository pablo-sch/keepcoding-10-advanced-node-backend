import session from "express-session";
import MongoStore from "connect-mongo";
import "dotenv/config";

const INACTIVITY_EXPIRATION_2_DAYS = 1000 * 60 * 60 * 24 * 2;

//Middleware to manage sessions============================================================================
export const middleware = session({
  name: "nodepop-session",
  //secret: "}]JQ1gY9?S>O6t;Y(7~K",
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: false,
  cookie: { maxAge: INACTIVITY_EXPIRATION_2_DAYS },
  store: MongoStore.create({
    /*
      uses MongoDB to store sessions instead of server memory.
      if the connection is cut off and reconnected to the DB the session will be maintained,
      as the DB stores such memory not in local memory.
    */

    //mongoUrl: "mongodb://localhost/nodepop",
    mongoUrl: process.env.MONGODB_CONNSTR,
  }),
});

//Middleware to pass the session to the views==============================================================
export function useSessionInViews(req, res, next) {
  // assigns the user's session to a view-accessible variable, allowing session data to be used in the frontend
  res.locals.session = req.session;
  res.locals.user = req.session.user || null;
  next();
}

//Routing protection Middleware============================================================================
export function guard(req, res, next) {
  const user = req.session.user;

  if (!user || !user.id) {
    return res.redirect(`/login?redir=${req.url}`);
    /* 
      - if session has no user, redirects to login page, passing as parameter ‘redirect’ the current URL.
      - the "user" attribute was inserted in "session" in "loginController" and "userControler".
    */
  }
  next();
}
