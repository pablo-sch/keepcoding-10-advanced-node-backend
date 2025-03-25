export async function index(req, res, next) {
  try {
    console.log("🚀 Entrando al controlador /user");
    res.render('profile');
  } catch (error) {
    console.error("❌ Error en el controlador /user:", error);
    next(error);
  }
}
