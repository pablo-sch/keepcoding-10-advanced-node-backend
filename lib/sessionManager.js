import session from "express-session";
import MongoStore from "connect-mongo";

const INACTIVITY_EXPIRATION_2_DAYS = 1000 * 60 * 60 * 24 * 2;

//Middleware to manage sessions============================================================================
export const middleware = session({
  name: "nodepop-session",
  secret: "}]JQ1gY9?S>O6t;Y(7~K",
  saveUninitialized: true,
  resave: false,
  cookie: { maxAge: INACTIVITY_EXPIRATION_2_DAYS },
  store: MongoStore.create({
    /*
      uses MongoDB to store sessions instead of server memory.
      if the connection is cut off and reconnected to the DB the session will be maintained,
      as the DB stores such memory not in local memory.
    */
    mongoUrl: "mongodb://localhost/nodepop",
  }),
});

//Middleware to pass the session to the views==============================================================
export function useSessionInViews(req, res, next) {
  // this middleware makes the variable ‘session’ available in all views (templates)

  res.locals.session = req.session;
  res.locals.user = req.session.user || null;
  // assigns the user's session to a view-accessible variable, allowing session data to be used in the frontend
  next();
}

//Routing protection middleware============================================================================
export function guard(req, res, next) {
  // this middleware protects routes that require a uthentication

  const a = req.session.id;
  if (!a) {
    res.redirect(`/login?redir=${req.url}`);
    /* 
      if the user has no userId, redirects the user to the login page, passing as parameter ‘redirect’ the current URL
      the ‘userId’ attribute was inserted in the ‘session’ object in ‘indexController.js’.
    */
    return;
  }
  next();
}
