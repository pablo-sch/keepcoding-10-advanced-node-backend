export async function index(req, res, next) {
  try {
    res.render('user');
  } catch (error) {
    next(error);
  }
}
