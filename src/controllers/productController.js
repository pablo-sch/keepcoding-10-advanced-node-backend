import Product from "../../models/Product.js";

//postNew Middleware=============================================================
export async function postNew(req, res, next) {
  try {
    const { name, price, tag } = req.body;
    const userId = req.session.user.id;

    const photoFilename = req.file?.filename || "placeholder-image.jpg";

    const product = new Product({
      name,
      owner: userId,
      price,
      tag,
      photo: photoFilename,
    });

    await product.save();

    res.redirect("/");
    // if I use ‘res.render’, the last POST request will be resent.
    // so if I reload the page it will reinsert the last product.
  } catch (error) {
    next(error);
  }
}
