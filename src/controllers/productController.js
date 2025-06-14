import Product from "../../models/Product.js";

//postNew Middleware=============================================================
export async function postNew(req, res, next) {
  try {
    const { name, price } = req.body;
    const userId = req.session.user.id;
    //const imagePath = req.file ? req.file.filename : null;

    const product = new Product({
      name,
      owner: userId,
      price,
      photo: req.file.filename,
    });

    await product.save();

    res.redirect("/");
    // if I use ‘res.render’, the last POST request will be resent.
    // so if I reload the page it will reinsert the last product.
  } catch (error) {
    next(error);
  }
}
