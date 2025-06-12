import session from 'express-session'
import MongoStore from 'connect-mongo'

const INACTIVITY_EXPIRATION_2_DAYS = 1000 * 60 * 60 * 24 * 2

//Middleware to manage sessions============================================================================
export const middleware = session({
  // this middleware is in charge of managing sessions

  name: 'nodepop-session',
  // name of the cookie where the session will be stored in the user's browser

  secret: '}]JQ1gY9?S>O6t;Y(7~K',
  // secret used to sign the server session and protect it against external manipulation

  saveUninitialized: true,
  // creates a session for each user even if he/she is not logged in (an empty session)

  resave: false,
  // avoids saving the session on each request if it has not been modified, reducing the load on the database

  cookie: { maxAge: INACTIVITY_EXPIRATION_2_DAYS },
  // sets the lifetime of the cookie

  store: MongoStore.create({
    /*
      uses MongoDB to store sessions instead of server memory.
      if the connection is cut off and reconnected to the DB the session will be maintained,
      as the DB stores such memory not in local memory.
    */

    mongoUrl: 'mongodb://localhost/nodepop'
    // Specifies the connection to the MongoDB database
  })
})

//Middleware to pass the session to the views==============================================================
export function useSessionInViews(req, res, next) {
  // this middleware makes the variable ‘session’ available in all views (templates)

  res.locals.session = req.session
  // assigns the user's session to a view-accessible variable, allowing session data to be used in the frontend
  next()
}

//Routing protection middleware============================================================================
export function guard(req, res, next) {
  // this middleware protects routes that require a
  // uthentication  


  const a = req.session.id
  if (!a) {
    res.redirect(`/login?redir=${req.url}`)
    /* 
      if the user has no userId, redirects the user to the login page, passing as parameter ‘redirect’ the current URL
      the ‘userId’ attribute was inserted in the ‘session’ object in ‘indexController.js’.
    */
    return
  }
  next()
}