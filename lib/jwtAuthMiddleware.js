import jwt from "jsonwebtoken";

export function guard(req, res, next) {
  let tokenJWT = req.get("Authorization") || req.body.jwt || req.query.jwt;

  if (!tokenJWT) {
    return next(createError(401, "No Token Provided."));
  }

  if (tokenJWT.startsWith("Bearer ")) {
    tokenJWT = tokenJWT.slice(7); // Remove the first 7 characters “Bearer ” from the Authorization header
  }

  jwt.verify(tokenJWT, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return next(createError(401, "Invalid Token."));
    }

    req.apiUserId = payload.user_id;

    next();
  });
}
