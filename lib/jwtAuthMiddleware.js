import jwt from "jsonwebtoken";
import createError from "http-errors";

export function guard(req, res, next) {
  // get theJWT token from: header, body, query-string
  const tokenJWT = req.get("Authorization") || req.body.jwt || req.query.jwt;

  // if no token has been sent --> error
  if (!tokenJWT) {
    next(createError(401, "No Token Provided."));
    return;
  }

  // check that the token is valid
  jwt.verify(tokenJWT, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      next(createError(401, "Invalid Token."));
      return;
    }

    // we write down the id of the logged in user in the request
    // so that the next middlewares can easily read it
    req.apiUserId = payload.user_id;

    next();
  });
}
