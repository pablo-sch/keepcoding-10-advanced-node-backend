import fs from 'fs';
import path from 'path';
import createError from 'http-errors';

import Product from '../../models/Product.js';
import User from '../../models/User.js'


export async function index(req, res, next) {
  try {

    //res.render(‘index’, { title: ‘Express’ }); // --> The variable ‘title’ in my index.ejs will be called by ‘Express’.
    //res.locals.title = Express // --> same as above

    const userId = req.session.userId
    const products = await Product.find({ owner: userId });
    res.locals.users = await User.find({ owner: userId })
    res.render('index', { products });

  } catch (error) {
    next(error)
  }
}

export async function postNew(req, res, next) {
  try {
    const { name, price } = req.body
    const userId = req.session.userId
    const imagePath = req.file ? req.file.filename : null;

    const product = new Product({ name, owner: userId, price, photo: imagePath })

    await product.save();

    res.redirect('/')
    // if I use ‘res.render’, the last POST request will be resent.
    // so if I reload the page it will reinsert the last product.

  } catch (error) {
    next(error)
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const userId = req.session.userId
    const productId = req.params.productId

    // Search for the product before disposal
    const product = await Product.findOne({ _id: productId, owner: userId });

    if (!product) {
      return next(createError(404, 'Product not found'));
    }

    // If the product has a photo, delete the image from the file system
    if (product.photo) {
      // Path of the image in the file system
      const imagePath = path.join(import.meta.dirname, '..', '..', 'public', 'images', product.photo);

      // Delete the image from the image folder
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error when deleting the image:', err);
        } else {
          console.log('Image deleted:', imagePath);
        }
      });
    }

    await Product.deleteOne({ _id: productId, owner: userId })

    res.redirect('/')

  } catch (error) {
    next(error)
  }
}