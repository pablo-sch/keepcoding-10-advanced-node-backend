export async function index(req, res, next) {
  try {

    //res.render('index', { title: 'Express' }); // --> La variable 'title' en mi index.ejs será llamada 'Express'
    //res.locals.title = Express // --> lo mismo que arriba
    res.render('index')

  } catch (error) {
    next(error)
  }
}

//export default router;
