export async function index(req, res, next) {
  try {
    res.render("login");
  } catch (error) {
    next(error);
  }
}