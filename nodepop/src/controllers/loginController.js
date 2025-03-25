export async function index(req, res, next) {
  try {
    console.log("🚀 Entrando al controlador /login");
    res.send("Página de login");
  } catch (error) {
    next(error);
  }
}