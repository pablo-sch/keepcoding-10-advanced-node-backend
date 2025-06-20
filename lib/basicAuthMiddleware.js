import basicAuth from "basic-auth";

export default function (req, res, next) {
  const credentials = basicAuth(req);
  if (!credentials || credentials.name !== "admin" || credentials.pass !== "1234") {
    res.set("WWW-Authenticate", "Basic realm=Authorization required");
    res.sendStatus(401);
    return;
  }
  next();
}
