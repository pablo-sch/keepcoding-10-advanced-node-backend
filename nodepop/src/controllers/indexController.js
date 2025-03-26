import Product from '../../models/Product.js';
import User from '../../models/User.js'


export async function index(req, res, next) {
  try {

    //res.render('index', { title: 'Express' }); // --> La variable 'title' en mi index.ejs será llamada 'Express'
    //res.locals.title = Express // --> lo mismo que arriba

    const userId = req.session.userId
    res.locals.users = await User.find({ owner: userId })

    const products = await Product.find();
    console.log(products);

    res.render('index', { products });

  } catch (error) {
    next(error)
  }
}

//export default router;
